import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import { generateDailyPlan } from '@/lib/planner/daily-scheduler';
import { DailyPlan, TaskType } from '@/types/planner';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

const CheckinSchema = z.object({
  energyMood: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  availableHours: z.number().min(0.5).max(16),
  disruptions: z.array(z.string()).default([]),
  notes: z.string().optional(),
  hasTestToday: z.boolean().optional(),
  testName: z.string().optional(),
});

const RequestBodySchema = z.object({
  checkin: CheckinSchema,
  examMode: z.enum(['prelims', 'mains', 'combined']).default('prelims'),
  progressMap: z.record(z.string(), z.any()).optional().default({}),
  recentSubjectHours: z.record(z.string(), z.number()).optional().default({}),
  consecutiveDaysOnSubject: z.record(z.string(), z.number()).optional().default({}),
});

const AIPlanTaskSchema = z.object({
  id: z.string(),
  subjectId: z.string(),
  subjectName: z.string(),
  topicId: z.string(),
  topicTitle: z.string(),
  subtopicTitle: z.string().optional(),
  taskType: z.enum([
    'new_study',
    'revision',
    'pyq',
    'current_affairs',
    'answer_writing',
    'mock_test',
    'break',
  ]),
  durationMinutes: z.number().int().min(15).max(180),
  reason: z.string(),
});

const AIPlanResponseSchema = z.object({
  tasks: z.array(AIPlanTaskSchema).min(2).max(6),
  isMinimumViableDay: z.boolean(),
  mentorRationale: z.string(),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rateLimit = checkRateLimit(`plan_${ip}`, { limit: 20, windowMs: 60000 });
  const headers = getRateLimitHeaders(rateLimit);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many plan requests. Please wait a moment.' },
      { status: 429, headers }
    );
  }

  try {
    const rawBody = await req.json();
    const parsed = RequestBodySchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input payload', details: parsed.error.format() },
        { status: 400, headers }
      );
    }

    const { checkin, examMode, progressMap, recentSubjectHours, consecutiveDaysOnSubject } = parsed.data;

    // Check if OpenAI API key is present and configured
    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey && apiKey !== 'mock-key-placeholder' && !apiKey.startsWith('demo')) {
      try {
        const openai = new OpenAI({ apiKey });

        const systemPrompt = `You are "My Mentor", the lead academic mentor for UPSC Civil Services Examination 2027.
You generate personalized, grounded daily study plans following strict pedagogical principles:
1. Candidate energy & mood: On low energy (mood <= 2 or hours < 3.5), enforce a Minimum Viable Day (2-3 tasks max, light review and current affairs only, no heavy new topics).
2. Spaced Repetition: Prioritize due revisions (intervals of 1, 7, 21, 45 days).
3. Guardrails: No single subject should dominate > 35% of preparation time.
4. Essential components: Every day must contain a Current Affairs slot. In Mains/Combined, include answer writing.
5. The candidate is an adult aspirant preparing for a grueling exam: speak with calm clarity, empathy, and intellectual respect. Never guilt-trip.

Output MUST be valid JSON adhering exactly to this schema:
{
  "tasks": [
    {
      "id": "task-1",
      "subjectId": "string",
      "subjectName": "string",
      "topicId": "string",
      "topicTitle": "string",
      "subtopicTitle": "string",
      "taskType": "new_study" | "revision" | "pyq" | "current_affairs" | "answer_writing" | "mock_test",
      "durationMinutes": number,
      "reason": "one-line clear justification"
    }
  ],
  "isMinimumViableDay": boolean,
  "mentorRationale": "2-3 sentences explaining why today's plan is constructed this way"
}`;

        const userPrompt = `Aspirant Check-in for today:
- Energy/Mood: ${checkin.energyMood}/5
- Available Study Hours: ${checkin.availableHours} hours (${Math.round(checkin.availableHours * 60)} minutes)
- Disruptions / Context: ${checkin.disruptions.join(', ') || 'None'}
- Notes: ${checkin.notes || 'None'}
- Test today: ${checkin.hasTestToday ? checkin.testName || 'Yes' : 'No'}
- Exam Mode: ${examMode}
- Recent Subject Hours: ${JSON.stringify(recentSubjectHours)}

Generate today's structured daily plan matching available hours within +-20 minutes.`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.4,
        });

        const rawContent = completion.choices[0]?.message?.content;
        if (rawContent) {
          const aiJson = JSON.parse(rawContent);
          const validation = AIPlanResponseSchema.safeParse(aiJson);

          if (validation.success) {
            const dateStr = new Date().toISOString().split('T')[0];
            const validatedData = validation.data;

            const finalPlan: DailyPlan = {
              id: `plan-${dateStr}-${Date.now()}`,
              date: dateStr,
              checkin,
              tasks: validatedData.tasks.map((t, idx) => ({
                id: `task-${idx + 1}`,
                subjectId: t.subjectId,
                subjectName: t.subjectName,
                topicId: t.topicId,
                topicTitle: t.topicTitle,
                subtopicTitle: t.subtopicTitle,
                taskType: t.taskType as TaskType,
                durationMinutes: t.durationMinutes,
                completedMinutes: 0,
                status: 'pending',
                reason: t.reason,
                orderIndex: idx + 1,
              })),
              status: 'proposed',
              isMinimumViableDay: validatedData.isMinimumViableDay,
              targetHours: checkin.availableHours,
              totalPlannedMinutes: validatedData.tasks.reduce((sum, t) => sum + t.durationMinutes, 0),
              totalCompletedMinutes: 0,
              mentorRationale: validatedData.mentorRationale,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            return NextResponse.json({
              success: true,
              plan: finalPlan,
              source: 'ai',
            });
          }
        }
      } catch (aiErr) {
        console.warn('AI plan generation failed, falling back to deterministic scheduler:', aiErr);
      }
    }

    // Fallback: Deterministic Scheduler Engine (ensures zero downtime, 100% reliability)
    const fallbackPlan = generateDailyPlan({
      checkin,
      examMode,
      progressMap,
      recentSubjectHours,
      consecutiveDaysOnSubject,
    });

    return NextResponse.json({
      success: true,
      plan: fallbackPlan,
      source: 'deterministic_fallback',
    });
  } catch (error) {
    console.error('API route error in /api/ai/plan-generator:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while creating daily plan' },
      { status: 500 }
    );
  }
}
