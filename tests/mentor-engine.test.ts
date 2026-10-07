import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateGroundedMentorReply,
  MENTOR_QUICK_PROMPTS,
} from '../src/lib/mentor/mentor-engine.ts';
import { MentorUserContext } from '../src/types/mentor.ts';

describe('Phase 8 Built-In UPSC 2027 Strategy & Mentorship Engine', () => {
  const baseContext: MentorUserContext = {
    fullName: 'Aditya Sharma',
    examMode: 'combined',
    streakDays: 14,
    overdueCount: 3,
    retentionPercent: 78,
    overIndexedSubject: 'Modern History',
    neglectedSubject: 'Ethics (GS IV)',
  };

  test('contains 6 essential UPSC quick prompts', () => {
    assert.equal(MENTOR_QUICK_PROMPTS.length, 6);
    assert.ok(MENTOR_QUICK_PROMPTS.some((qp) => qp.id === 'qp-mains-writing'));
    assert.ok(MENTOR_QUICK_PROMPTS.some((qp) => qp.id === 'qp-fatigue'));
    assert.ok(MENTOR_QUICK_PROMPTS.some((qp) => qp.id === 'qp-ethics'));
    assert.ok(MENTOR_QUICK_PROMPTS.some((qp) => qp.id === 'qp-balance'));
    assert.ok(MENTOR_QUICK_PROMPTS.some((qp) => qp.id === 'qp-prelims-yield'));
    assert.ok(MENTOR_QUICK_PROMPTS.some((qp) => qp.id === 'qp-csat'));
  });

  test('handles fatigue and burnout with empathy and Minimum Viable Day proposal', () => {
    const reply = generateGroundedMentorReply("I'm feeling really fatigued and overwhelmed today", baseContext);

    assert.equal(reply.sender, 'mentor');
    assert.ok(reply.text.includes('Aditya'));
    assert.ok(reply.text.includes('Minimum Viable Day'));
    assert.ok(reply.text.includes('Zero Guilt'));
    assert.ok(reply.proposal);
    assert.equal(reply.proposal?.actionType, 'minimum_viable_day');
    assert.equal(reply.proposal?.status, 'pending');
    assert.ok(reply.citations && reply.citations.length > 0);
  });

  test('provides structured 3-part blueprint for Mains answer writing with citations', () => {
    const reply = generateGroundedMentorReply('How should I structure a 10-marker and 15-marker answer for Mains?', baseContext);

    assert.equal(reply.sender, 'mentor');
    assert.ok(reply.text.includes('Introduction'));
    assert.ok(reply.text.includes('PESTLE'));
    assert.ok(reply.text.includes('Conclusion'));
    assert.ok(reply.text.includes('2nd ARC'));
    assert.ok(reply.citations && reply.citations.some((c) => c.paper?.includes('Mains')));
  });

  test('provides 5-step framework for GS IV Ethics case studies with Nolan principles', () => {
    const reply = generateGroundedMentorReply('What is the framework to solve Ethics case studies?', baseContext);

    assert.equal(reply.sender, 'mentor');
    assert.ok(reply.text.includes('Stakeholders'));
    assert.ok(reply.text.includes('Dilemmas'));
    assert.ok(reply.text.includes('Nolan'));
    assert.ok(reply.proposal);
    assert.equal(reply.proposal?.actionType, 'add_ethics_slot');
    assert.equal(reply.proposal?.adjustedMinutes, 45);
  });

  test('injects live student context into preparation diagnostic analysis', () => {
    const reply = generateGroundedMentorReply('Analyze my current preparation balance and backlogs', baseContext);

    assert.equal(reply.sender, 'mentor');
    assert.ok(reply.text.includes('3 overdue revision'));
    assert.ok(reply.text.includes('78%'));
    assert.ok(reply.text.includes('Modern History'));
    assert.ok(reply.text.includes('14-day streak'));
  });

  test('delivers high-yield Prelims PYQ pillars and CSAT qualification strategy', () => {
    const prelimsReply = generateGroundedMentorReply('Which are the high-yield topics for Prelims GS1?', baseContext);
    assert.ok(prelimsReply.text.includes('Fundamental Rights'));
    assert.ok(prelimsReply.text.includes('Wildlife Protection Act'));
    assert.ok(prelimsReply.text.includes('Monsoon dynamics'));

    const csatReply = generateGroundedMentorReply('How to prepare CSAT to clear cutoff?', baseContext);
    assert.ok(csatReply.text.includes('33%') || csatReply.text.includes('66.67'));
    assert.ok(csatReply.text.includes('Number Systems'));
    assert.ok(csatReply.text.includes('Critical Assumption'));
  });
});
