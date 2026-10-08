import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Task 9: Navigation & Icon Buttons Accessibility', () => {
  test('BottomNav includes Settings navigation item with aria-label', () => {
    const bottomNavPath = path.resolve(process.cwd(), 'src/components/layout/BottomNav.tsx');
    const content = fs.readFileSync(bottomNavPath, 'utf8');

    assert.match(content, /id:\s*'settings'/, 'BottomNav must include settings item');
    assert.match(content, /href:\s*'\/settings'/, 'BottomNav must link to /settings');
    assert.match(content, /aria-label=\{item\.label\}/, 'BottomNav links must have accessible aria-label');
  });

  test('TopHeader includes accessible Settings link with aria-label and title', () => {
    const topHeaderPath = path.resolve(process.cwd(), 'src/components/layout/TopHeader.tsx');
    const content = fs.readFileSync(topHeaderPath, 'utf8');

    assert.match(content, /href="\/settings"/, 'TopHeader must contain /settings link');
    assert.match(content, /aria-label="Settings"/, 'TopHeader Settings link must have aria-label="Settings"');
    assert.match(content, /title="Settings"/, 'TopHeader Settings link must have title="Settings"');
  });

  test('Interactive icon buttons in modals and widgets have explicit aria-label attributes', () => {
    const filesToTest = [
      {
        path: 'src/components/planner/TaskEditModal.tsx',
        pattern: /aria-label="Close dialog"/,
        desc: 'TaskEditModal close button',
      },
      {
        path: 'src/components/planner/MorningCheckinModal.tsx',
        pattern: /aria-label="Close morning check-in"/,
        desc: 'MorningCheckinModal close button',
      },
      {
        path: 'src/components/planner/EndOfDayWrapupModal.tsx',
        pattern: /aria-label="Close end-of-day wrap-up"/,
        desc: 'EndOfDayWrapupModal close button',
      },
      {
        path: 'src/components/syllabus/SubtopicDetailSheet.tsx',
        pattern: /aria-label="Close subtopic details"/,
        desc: 'SubtopicDetailSheet close button',
      },
      {
        path: 'src/components/revision/RevisionManagerSheet.tsx',
        pattern: /aria-label="Close revision manager"/,
        desc: 'RevisionManagerSheet close button',
      },
      {
        path: 'src/components/timer/StudyTimerWidget.tsx',
        pattern: /aria-label="Reset study timer"/,
        desc: 'StudyTimerWidget reset button',
      },
    ];

    for (const file of filesToTest) {
      const filePath = path.resolve(process.cwd(), file.path);
      const content = fs.readFileSync(filePath, 'utf8');
      assert.match(content, file.pattern, `${file.desc} should have appropriate aria-label`);
    }
  });
});
