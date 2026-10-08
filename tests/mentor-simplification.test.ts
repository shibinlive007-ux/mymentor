import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { getContextualChips } from '../src/lib/mentor/mentor-engine.ts';
import { MentorUserContext } from '../src/types/mentor.ts';

test('Task 15: Mentor tab simplification & contextual chips', async (t) => {
  const mentorPagePath = path.resolve(process.cwd(), 'src/app/(dashboard)/mentor/page.tsx');
  const pageContent = fs.readFileSync(mentorPagePath, 'utf8');

  await t.test('getContextualChips returns between 2 and 3 focused chips tailored to aspirant state', () => {
    // Case A: Aspirant with overdue revisions in Prelims mode
    const ctxA: MentorUserContext = {
      fullName: 'Rahul Verma',
      examMode: 'prelims',
      streakDays: 5,
      overdueCount: 4,
      retentionPercent: 72,
    };
    const chipsA = getContextualChips(ctxA);
    assert.ok(chipsA.length >= 2 && chipsA.length <= 3, 'Must return 2-3 chips');
    assert.ok(chipsA.some((c) => c.id === 'ctx-revisions'), 'Must offer revision catchup chip');
    assert.ok(chipsA.some((c) => c.id === 'ctx-prelims'), 'Must offer prelims high-yield chip');

    // Case B: Aspirant in Mains mode with a neglected subject
    const ctxB: MentorUserContext = {
      fullName: 'Ananya Roy',
      examMode: 'mains',
      streakDays: 12,
      overdueCount: 0,
      retentionPercent: 95,
      neglectedSubject: 'Ethics (GS IV)',
    };
    const chipsB = getContextualChips(ctxB);
    assert.ok(chipsB.length >= 2 && chipsB.length <= 3, 'Must return 2-3 chips');
    assert.ok(chipsB.some((c) => c.id === 'ctx-mains'), 'Must offer mains answer writing chip');
    assert.ok(chipsB.some((c) => c.id === 'ctx-neglected'), 'Must offer neglected subject chip');

    // Case C: New aspirant with clean zero state
    const ctxC: MentorUserContext = {
      fullName: 'Vikram',
      examMode: 'combined',
      streakDays: 0,
      overdueCount: 0,
      retentionPercent: 100,
    };
    const chipsC = getContextualChips(ctxC);
    assert.ok(chipsC.length >= 2 && chipsC.length <= 3, 'Must return 2-3 chips');
    assert.ok(chipsC.some((c) => c.id === 'ctx-balance'));
    assert.ok(chipsC.some((c) => c.id === 'ctx-fatigue'));
  });

  await t.test('mentor page has a single clean prompt box with accessible aria-label', () => {
    assert.match(pageContent, /aria-label="Ask My Mentor"/);
    assert.match(pageContent, /aria-label="Send message"/);
    assert.match(pageContent, /getContextualChips\(getUserContext\(\)\)/);
  });

  await t.test('real user path initializes with clean zero state, isolating demo fallbacks', () => {
    assert.match(pageContent, /localStorage\.getItem\('upsc_demo_mode'\)\s*===\s*'true'/);
    // Real path starts streakDays at 0 and overdueCount at 0
    assert.match(pageContent, /streakDays:\s*profile\?\.streak_count\s*\|\|\s*0/);
    assert.match(pageContent, /let overdueCount = 0/);
  });
});
