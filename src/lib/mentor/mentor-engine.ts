/**
 * Built-In UPSC 2027 Strategy & Mentorship Engine
 *
 * 100% Free & Local — operates with zero external OpenAI API dependencies.
 * Provides grounded, pedagogically sound advice on:
 * - Mains Answer Writing frameworks (Intro-Body-Conclusion, PESTLE)
 * - Ethics (GS IV) Case Studies & Nolan Principles
 * - Prelims High-Yield PYQ trends & Cutoff strategy
 * - CSAT qualification minimums
 * - Fatigue & Burnout recovery (Minimum Viable Day protocol)
 * - Real-time preparation analysis using student state
 */

import {
  MentorMessage,
  MentorUserContext,
  MentorPlanProposal,
} from '@/types/mentor';

export interface QuickPrompt {
  id: string;
  icon: string;
  label: string;
  query: string;
}

export const MENTOR_QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: 'qp-mains-writing',
    icon: '✍️',
    label: 'Mains Answer Framework',
    query: 'How should I structure a 10-marker and 15-marker Mains answer for GS papers?',
  },
  {
    id: 'qp-fatigue',
    icon: '🛡️',
    label: 'Low Energy / Fatigue',
    query: "I'm feeling fatigued and overwhelmed today. How can I adjust my schedule without guilt?",
  },
  {
    id: 'qp-ethics',
    icon: '⚖️',
    label: 'Ethics Case Studies',
    query: 'What is the step-by-step framework to solve GS IV Ethics case studies?',
  },
  {
    id: 'qp-balance',
    icon: '📊',
    label: 'Analyze My Prep Balance',
    query: 'Analyze my current preparation balance, streak, and revision backlogs.',
  },
  {
    id: 'qp-prelims-yield',
    icon: '🎯',
    label: 'Prelims High-Yield Pillars',
    query: 'Which topics carry the highest PYQ yield in Prelims GS1?',
  },
  {
    id: 'qp-csat',
    icon: '📐',
    label: 'CSAT Qualification Guide',
    query: 'How should I allocate time for CSAT to comfortably cross the 66.7-mark threshold?',
  },
];

/**
 * Generates 2-3 focused contextual chips derived from the aspirant's current state.
 */
export function getContextualChips(
  context: MentorUserContext,
  activeTaskName?: string
): QuickPrompt[] {
  const chips: QuickPrompt[] = [];

  // 1. Revision / Backlog context
  if (context.overdueCount > 0) {
    chips.push({
      id: 'ctx-revisions',
      icon: '🔄',
      label: `Prioritize ${context.overdueCount} Backlogs`,
      query: `How should I catch up on my ${context.overdueCount} overdue revisions without burning out?`,
    });
  }

  // 2. Exam mode specific chip
  if (context.examMode === 'prelims') {
    chips.push({
      id: 'ctx-prelims',
      icon: '🎯',
      label: 'Prelims High-Yield Topics',
      query: 'Which topics carry the highest PYQ yield in Prelims GS1?',
    });
  } else if (context.examMode === 'mains') {
    chips.push({
      id: 'ctx-mains',
      icon: '✍️',
      label: 'Mains 10/15 Marker Blueprint',
      query: 'How should I structure a 10-marker and 15-marker Mains answer for GS papers?',
    });
  } else {
    // Combined mode
    if (activeTaskName) {
      chips.push({
        id: 'ctx-active-task',
        icon: '🎯',
        label: `Clarify: ${activeTaskName.length > 20 ? activeTaskName.slice(0, 18) + '...' : activeTaskName}`,
        query: `Explain key conceptual nuances and PYQ focus points for ${activeTaskName}.`,
      });
    } else {
      chips.push({
        id: 'ctx-balance',
        icon: '📊',
        label: 'Analyze Study Balance',
        query: 'Analyze my current preparation balance, streak, and revision backlogs.',
      });
    }
  }

  // 3. Neglected subject
  if (context.neglectedSubject && chips.length < 3) {
    chips.push({
      id: 'ctx-neglected',
      icon: '⚖️',
      label: `Catch up: ${context.neglectedSubject}`,
      query: `How should I allocate time to bridge my gap in ${context.neglectedSubject}?`,
    });
  }

  // 4. Low energy fallback
  if (chips.length < 3) {
    chips.push({
      id: 'ctx-fatigue',
      icon: '🛡️',
      label: 'Low Energy / Fatigue',
      query: "I'm feeling fatigued and overwhelmed today. How can I adjust my schedule without guilt?",
    });
  }

  // Strictly 2-3 chips
  return chips.slice(0, 3);
}

export function generateGroundedMentorReply(
  query: string,
  context: MentorUserContext
): MentorMessage {
  const normalized = query.toLowerCase().trim();
  const firstName = context.fullName.split(' ')[0] || 'Aspirant';

  // 1. Fatigue, Low Energy, Burnout, Stress
  if (
    normalized.includes('fatigue') ||
    normalized.includes('tired') ||
    normalized.includes('burnout') ||
    normalized.includes('exhausted') ||
    normalized.includes('low energy') ||
    normalized.includes('overwhelmed') ||
    normalized.includes('guilt') ||
    normalized.includes('stress')
  ) {
    const proposal: MentorPlanProposal = {
      id: `prop-mvd-${Date.now()}`,
      title: 'Activate Minimum Viable Day (MVD)',
      reason: 'Reduces today to 2-3 essential tasks, protecting continuity without cognitive burnout.',
      actionType: 'minimum_viable_day',
      status: 'pending',
    };

    return {
      id: `m-reply-${Date.now()}`,
      sender: 'mentor',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `${firstName}, hearing your body is a core preparation skill. UPSC 2027 is an endurance test spanning hundreds of days, not a 1-day sprint. Pushing through severe fatigue leads to shallow retention and multi-day slumps.\n\nHere is your Grounded Action Plan for today:\n1. **Zero Guilt Protocol**: Accept that recovery is an active part of consolidation. Your brain strengthens neural pathways during restorative rest.\n2. **Minimum Viable Day**: Complete only 1 foundational task (30 mins of current affairs or 1 light revision) and defer heavy new concepts.\n3. **Early Wind-down**: Disconnect from screens by 9:30 PM. 8 hours of sleep tonight will restore your focus bandwidth for tomorrow.`,
      citations: [
        { label: 'UPSC 2027 Pedagogical Rule: Consistency Over Intensity', paper: 'General Strategy' },
      ],
      proposal,
    };
  }

  // 2. Mains Answer Writing
  if (
    normalized.includes('answer writing') ||
    normalized.includes('10-marker') ||
    normalized.includes('15-marker') ||
    normalized.includes('structure') ||
    normalized.includes('mains answer') ||
    normalized.includes('intro') ||
    normalized.includes('conclusion')
  ) {
    return {
      id: `m-reply-${Date.now()}`,
      sender: 'mentor',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Here is the Topper-Tested Blueprint for UPSC Mains General Studies answers:\n\n**1. Introduction (15–20 words)**\n- Start directly with a crisp definition, a relevant Constitutional Article, Supreme Court judgment, or authentic data point (e.g. NITI Aayog report, NFHS-5, RBI bulletin).\n- Avoid generic rhetorical openings.\n\n**2. Body Architecture (70–80% of space)**\n- **Subheading 1**: Address the primary core demand of the question directly.\n- **Subheading 2**: Address the secondary/counter demand (challenges, bottlenecks, unintended consequences).\n- **Use Frameworks**: Break points into multi-dimensional buckets using PESTLE (Political, Economic, Social, Technological, Legal, Environmental) or Stakeholder mapping (Citizen, Industry, State).\n- **Micro-Diagram / Flowchart**: A clean 3-node flowchart or small Indian map saves 30 seconds and enhances readability.\n\n**3. Conclusion & Way Forward (20–25 words)**\n- Never end with mere criticism. Offer a constructive forward-looking recommendation citing an authentic committee (e.g., 2nd ARC, Punchhi, Vijay Kelkar) or an SDG goal.`,
      citations: [
        { label: 'Mains GS Paper I - IV Structural Rubric', paper: 'Mains GS Blueprint' },
        { label: '2nd ARC & Constitutional Morality Guidelines', paper: 'GS II & GS IV' },
      ],
    };
  }

  // 3. Ethics (GS IV) Case Studies & Theory
  if (
    normalized.includes('ethics') ||
    normalized.includes('case study') ||
    normalized.includes('case studies') ||
    normalized.includes('gs 4') ||
    normalized.includes('gs iv') ||
    normalized.includes('nolan')
  ) {
    const proposal: MentorPlanProposal = {
      id: `prop-eth-${Date.now()}`,
      title: 'Schedule 45-Min Ethics Case Study Practice',
      reason: 'Dedicate one focused afternoon slot to master the 5-step case study framework.',
      actionType: 'add_ethics_slot',
      status: 'pending',
      adjustedMinutes: 45,
    };

    return {
      id: `m-reply-${Date.now()}`,
      sender: 'mentor',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Ethics Case Studies carry **120 marks** out of 250 in GS IV. Follow this definitive 5-step approach:\n\n1. **Facts of the Case (2 lines)**: Summarize the primary situational conflict in concise words.\n2. **Stakeholders**: List Direct (District Magistrate, local villagers) and Indirect stakeholders (taxpayers, civil society, environment).\n3. **Ethical Dilemmas Involved**: Frame them as explicit tensions:\n   - *Public Interest vs. Administrative Rulebook Compliance*\n   - *Empathy towards vulnerable sections vs. Objective Legality*\n   - *Short-term relief vs. Long-term systemic sustainability*\n4. **Evaluate Feasible Options**: Present 3 distinct courses of action with Pros & Cons for each.\n5. **Chosen Course of Action**: Justify your final decision using the **Nolan Principles** (Selflessness, Integrity, Objectivity, Accountability, Openness, Honesty, Leadership) and **Constitutional Morality** (Articles 14, 21).`,
      citations: [
        { label: 'UPSC Mains GS Paper IV: Ethics, Integrity & Aptitude', paper: 'GS IV' },
        { label: 'Nolan Committee Principles of Public Life', paper: 'Administrative Ethics' },
      ],
      proposal,
    };
  }

  // 4. Current Preparation Analysis & Balances
  if (
    normalized.includes('analyze') ||
    normalized.includes('balance') ||
    normalized.includes('backlog') ||
    normalized.includes('streak') ||
    normalized.includes('progress') ||
    normalized.includes('my state')
  ) {
    const overdueText =
      context.overdueCount > 0
        ? `You have **${context.overdueCount} overdue revision(s)** requiring attention. Retention freshness is currently at **${context.retentionPercent}%**.`
        : `Your revision cadence is spotless with **0 overdue topics** and **${context.retentionPercent}% retention freshness**.`;

    const balanceText = context.overIndexedSubject
      ? `\n⚠️ **Guardrail Alert**: You have been dedicating substantial hours to *${context.overIndexedSubject}* (exceeding the 35% weekly balance cap). Keep this in check to protect GS3/Ethics.`
      : `\n✅ **Subject Allocation**: Your weekly study volume is distributed across multiple syllabus papers.`;

    const streakText = `\n🔥 **Consistency**: You are on an active **${context.streakDays}-day streak**.`;

    return {
      id: `m-reply-${Date.now()}`,
      sender: 'mentor',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Here is the diagnostic assessment of your current 2027 preparation:\n\n${overdueText}${balanceText}${streakText}\n\n**Mentor Directive**: Continue prioritizing spaced revision in your morning focus block. Consistency across weeks compounds quietly into top rank territory.`,
      citations: [
        { label: 'Personalized Preparation Memory & Spaced Repetition Engine', paper: 'Live Metrics' },
      ],
    };
  }

  // 5. CSAT Strategy
  if (
    normalized.includes('csat') ||
    normalized.includes('quant') ||
    normalized.includes('reasoning') ||
    normalized.includes('paper 2') ||
    normalized.includes('comprehension')
  ) {
    return {
      id: `m-reply-${Date.now()}`,
      sender: 'mentor',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `CSAT is qualifying (**33% = 66.67 marks out of 200**), but recent trends have made it a major elimination hurdle. Do not leave it for the last 2 months.\n\n**Strategy Blueprint**:\n1. **Quant Priority**: Master Number Systems, Percentages, Ratio-Proportion, and Time & Work. These form 60%+ of math questions.\n2. **Logical Reasoning**: Practice Syllogisms, Blood Relations, Seating Arrangement, and Direction Sense. These have high accuracy and zero ambiguity.\n3. **Reading Comprehension**: Practice 3-5 passages weekly. Focus strictly on identifying the **Crux / Critical Assumption** rather than personal opinions.\n4. **Routine Allocation**: Spend 45 minutes on CSAT every Saturday and Sunday afternoon. That is 90 mins/week, which guarantees qualification with zero stress.`,
      citations: [
        { label: 'CSAT Paper II Syllabus: Analytical Ability & Basic Numeracy', paper: 'Prelims GS-II' },
      ],
    };
  }

  // 6. Prelims High-Yield Topics & PYQ Trends
  if (
    normalized.includes('prelims') ||
    normalized.includes('high yield') ||
    normalized.includes('pyq') ||
    normalized.includes('cutoff') ||
    normalized.includes('important topics')
  ) {
    return {
      id: `m-reply-${Date.now()}`,
      sender: 'mentor',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `In Prelims GS1, approximately **65-70% of questions** come from recurrent core pillars. Prioritize these high-yield topics:\n\n1. **Indian Polity**: Fundamental Rights (Arts 12–35), DPSPs, Parliament legislative procedures, Supreme Court powers, Constitutional bodies (CAG, EC, UPSC).\n2. **Modern History**: 1857 Revolt & leaders, 19th Century Socio-Religious reforms, Gandhian mass movements (NCM, CDM, QIM), Acts of 1909, 1919 & 1935.\n3. **Environment & Ecology**: Wildlife Protection Act (1972 schedule species), National Parks & Biosphere Reserves, Ramsar wetlands, UNFCCC COP agreements.\n4. **Economy**: Inflation indicators (CPI vs WPI), RBI monetary tools (Repo, SLR, CRR), Balance of Payments, Trends in Banking & NPAs.\n5. **Physical Geography**: Monsoon dynamics (ITCZ, El Niño, IOD), Plate Tectonics, Ocean relief and currents.\n\n*Rule of Thumb: Solve minimum 15-20 PYQs immediately after completing each static chapter.*`,
      citations: [
        { label: 'UPSC CSE Prelims 10-Year Trend Analysis (2014-2024)', paper: 'Prelims GS-I' },
      ],
    };
  }

  // 7. General / Motivation / Study Technique
  return {
    id: `m-reply-${Date.now()}`,
    sender: 'mentor',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text: `${firstName}, every successful ranker in UPSC CSE faced the exact questions you are navigating now. The differentiator is never raw IQ — it is **calm consistency, active recall through spaced revision, and continuous linkage to previous years' questions (PYQs)**.\n\nKeep your daily target to 6–7 hours of deep, uninterrupted focus. Ground your study in standard NCERTs and primary references. What specific syllabus topic or preparation hurdle would you like to explore next?`,
    citations: [
      { label: 'UPSC CSE 2027 Official Notification & Syllabus Guidelines', paper: 'Core Curriculum' },
    ],
  };
}
