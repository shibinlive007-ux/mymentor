import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Task 8: Viewport Accessibility (No Zoom Lock)', () => {
  test('layout.tsx does not lock viewport zoom or restrict user scaling', () => {
    const layoutPath = path.resolve(process.cwd(), 'src/app/layout.tsx');
    const layoutContent = fs.readFileSync(layoutPath, 'utf8');

    // WCAG SC 1.4.4 forbids userScalable: false and maximumScale: 1
    assert.doesNotMatch(
      layoutContent,
      /userScalable:\s*false/i,
      'Viewport must not specify userScalable: false'
    );
    assert.doesNotMatch(
      layoutContent,
      /maximumScale:\s*1([^\d]|$)/i,
      'Viewport must not lock maximumScale to 1'
    );

    // Assert that userScalable is explicitly true or unrestricted
    assert.match(
      layoutContent,
      /userScalable:\s*true/i,
      'Viewport should explicitly enable userScalable: true'
    );
  });
});
