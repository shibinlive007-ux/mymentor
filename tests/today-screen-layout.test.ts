import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Task 14: Clean Today screen mobile layout order and progressive disclosure', async (t) => {
  const todayPath = path.resolve(process.cwd(), 'src/app/(dashboard)/today/page.tsx');
  const content = fs.readFileSync(todayPath, 'utf8');

  await t.test('enforces clean top banner with context-aware actions and countdown', () => {
    // Check days to prelims
    assert.match(content, /daysToPrelims.*days to Prelims 2027/);
    
    // Check context-aware daytime vs evening action
    assert.match(content, /isEvening\s*\?/);
    assert.match(content, /setIsWrapupOpen\(true\)/);
    assert.match(content, /setIsCheckinOpen\(true\)/);
    assert.match(content, /setIsRestModalOpen\(true\)/);
  });

  await t.test('strictly orders components: Top Banner -> Target Ring -> Active Timer -> Plan -> 1-Line Recovery Banner', () => {
    const topBannerPos = content.indexOf('{/* 1. Calm Top Banner: Days Countdown & Actions */}');
    const targetRingPos = content.indexOf('{/* 4. Primary Focus: Single Progress Ring & Today\'s Target */}');
    const timerPos = content.indexOf('<StudyTimerWidget');
    const planPos = content.indexOf('{/* 6. Today\'s Plan (3-6 tasks, uncluttered, interactive) */}');
    const recoveryBannerPos = content.indexOf('{/* 5. 1-Line Recovery Banner (Gentle recovery notice without cognitive clutter) */}');
    const wrapupPromptPos = content.indexOf('{/* 8. End of Day Wrap-up Prompt Banner */}');

    assert.ok(topBannerPos !== -1, 'Top banner comment should exist');
    assert.ok(targetRingPos !== -1, 'Target ring comment should exist');
    assert.ok(timerPos !== -1, 'Timer widget should exist');
    assert.ok(planPos !== -1, 'Today plan section should exist');
    assert.ok(recoveryBannerPos !== -1, '1-line recovery banner should exist');
    assert.ok(wrapupPromptPos !== -1, 'Wrap-up prompt section should exist');

    assert.ok(topBannerPos < targetRingPos, 'Top banner must precede target ring');
    assert.ok(targetRingPos < timerPos, 'Target ring must precede timer widget');
    assert.ok(timerPos < planPos, 'Timer widget must precede daily plan');
    assert.ok(planPos < recoveryBannerPos, 'Daily plan must precede 1-line recovery banner');
    assert.ok(recoveryBannerPos < wrapupPromptPos, 'Recovery banner must precede end-of-day wrap-up prompt');
  });

  await t.test('replaces intrusive RecoveryProposalCard in main flow with 1-line banner linking to RevisionManagerSheet', () => {
    // Main layout should not render <RecoveryProposalCard> inline above or below plan
    assert.doesNotMatch(content, /<RecoveryProposalCard/);
    // Banner provides concise "Gentle Recovery" text and button triggering RevisionManagerSheet
    assert.match(content, /Gentle Recovery:/);
    assert.match(content, /setIsRevisionSheetOpen\(true\)/);
  });

  await t.test('provides guilt-free rest day state protecting streak', () => {
    assert.match(content, /plan\.isRestDay/);
    assert.match(content, /Streak Protected • Planned Rest Day/);
    assert.match(content, /Rest is an Active Part of Preparation/);
  });
});
