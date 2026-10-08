import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Task 16: Progress tab progressive disclosure & primary visual cards', async (t) => {
  const progressPath = path.resolve(process.cwd(), 'src/app/(dashboard)/progress/page.tsx');
  const content = fs.readFileSync(progressPath, 'utf8');

  await t.test('strictly includes the 4 primary visual cards in the main view', () => {
    // 1. Weekly volume
    assert.match(content, /Weekly Performance Overview/);
    assert.match(content, /<WeeklyHoursChart/);

    // 2. Consistency heatmap
    assert.match(content, /<ConsistencyHeatmap/);

    // 3. Syllabus progress
    assert.match(content, /<StageProgressCards/);

    // 4. Spaced revision health
    assert.match(content, /Spaced Revision Health/);
    assert.match(content, /healthSummary\.retentionFreshnessPercent/);
  });

  await t.test('places secondary metrics behind an accessible See More progressive disclosure toggle', () => {
    // Toggle state declaration
    assert.match(content, /const \[showDetailedAnalytics, setShowDetailedAnalytics\] = useState\(false\);/);

    // Accessible toggle button with aria-expanded
    assert.match(content, /aria-expanded=\{showDetailedAnalytics\}/);
    assert.match(content, /See More/);
    assert.match(content, /Detailed Analytics (?:&|&amp;) Strategic Review/);

    // Secondary cards are gated behind showDetailedAnalytics
    assert.match(content, /\{showDetailedAnalytics && \(/);
    const splitContent = content.split('{showDetailedAnalytics && (');
    assert.equal(splitContent.length, 2, 'Detailed analytics should be conditionally enclosed in the accordion');

    const accordionBody = splitContent[1];
    assert.match(accordionBody, /<SubjectBalanceCard/);
    assert.match(accordionBody, /<WeeklyStrategicReviewCard/);
  });

  await t.test('verifies primary card layout order for optimal mobile cognitive load', () => {
    const volIndex = content.indexOf('<WeeklyHoursChart');
    const heatmapIndex = content.indexOf('<ConsistencyHeatmap');
    const syllabusIndex = content.indexOf('<StageProgressCards');
    const revisionIndex = content.indexOf('Spaced Revision Health');
    const seeMoreIndex = content.indexOf('aria-expanded={showDetailedAnalytics}');

    assert.ok(volIndex !== -1);
    assert.ok(heatmapIndex !== -1);
    assert.ok(syllabusIndex !== -1);
    assert.ok(revisionIndex !== -1);
    assert.ok(seeMoreIndex !== -1);

    // All 4 primary cards appear before the See More toggle
    assert.ok(volIndex < seeMoreIndex);
    assert.ok(heatmapIndex < seeMoreIndex);
    assert.ok(syllabusIndex < seeMoreIndex);
    assert.ok(revisionIndex < seeMoreIndex);
  });
});
