import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

function sRGBtoLin(c: number): number {
  const val = c / 255;
  return val <= 0.04045 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
}

function getRelativeLuminance(hex: string): number {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return 0.2126 * sRGBtoLin(r) + 0.7152 * sRGBtoLin(g) + 0.0722 * sRGBtoLin(b);
}

function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getRelativeLuminance(hex1);
  const l2 = getRelativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('Task 10: WCAG AA Contrast & Keyboard Focus Accessibility', () => {
  test('Light mode tokens pass WCAG AA (>= 4.5:1) text contrast', () => {
    const whiteSurface = '#ffffff';
    const bg = '#fbfbf9';
    const raised = '#f7f7f4';
    const foreground = '#1c1f24';
    const foregroundMuted = '#475569';
    const primary = '#1e6b52';

    // Primary text on white and background:
    const fgRatio = getContrastRatio(foreground, whiteSurface);
    assert.ok(fgRatio >= 7.0, `Foreground contrast (${fgRatio.toFixed(2)}) must exceed AAA 7:1`);

    // Muted text on white:
    const mutedRatioSurface = getContrastRatio(foregroundMuted, whiteSurface);
    assert.ok(
      mutedRatioSurface >= 4.5,
      `Foreground muted on surface (${mutedRatioSurface.toFixed(2)}) must exceed AA 4.5:1`
    );

    // Muted text on background:
    const mutedRatioBg = getContrastRatio(foregroundMuted, bg);
    assert.ok(
      mutedRatioBg >= 4.5,
      `Foreground muted on bg (${mutedRatioBg.toFixed(2)}) must exceed AA 4.5:1`
    );

    // Muted text on raised:
    const mutedRatioRaised = getContrastRatio(foregroundMuted, raised);
    assert.ok(
      mutedRatioRaised >= 4.5,
      `Foreground muted on raised (${mutedRatioRaised.toFixed(2)}) must exceed AA 4.5:1`
    );

    // Primary brand text on white:
    const primaryRatio = getContrastRatio(primary, whiteSurface);
    assert.ok(
      primaryRatio >= 4.5,
      `Primary text on surface (${primaryRatio.toFixed(2)}) must exceed AA 4.5:1`
    );
  });

  test('Dark mode tokens pass WCAG AA (>= 4.5:1) text contrast', () => {
    const darkBg = '#0d1117';
    const darkSurface = '#161b22';
    const darkForeground = '#f0f6fc';
    const darkForegroundMuted = '#9ba3af';
    const darkPrimary = '#2ea043';

    // Main dark text:
    const fgRatio = getContrastRatio(darkForeground, darkSurface);
    assert.ok(fgRatio >= 7.0, `Dark foreground contrast (${fgRatio.toFixed(2)}) must exceed AAA 7:1`);

    // Muted dark text:
    const mutedRatio = getContrastRatio(darkForegroundMuted, darkSurface);
    assert.ok(
      mutedRatio >= 4.5,
      `Dark muted contrast on surface (${mutedRatio.toFixed(2)}) must exceed AA 4.5:1`
    );

    const mutedBgRatio = getContrastRatio(darkForegroundMuted, darkBg);
    assert.ok(
      mutedBgRatio >= 4.5,
      `Dark muted contrast on bg (${mutedBgRatio.toFixed(2)}) must exceed AA 4.5:1`
    );

    // Dark primary green:
    const primaryRatio = getContrastRatio(darkPrimary, darkSurface);
    assert.ok(
      primaryRatio >= 4.5,
      `Dark primary contrast on surface (${primaryRatio.toFixed(2)}) must exceed AA 4.5:1`
    );
  });

  test('globals.css enforces visible keyboard focus indicator with focus-visible', () => {
    const cssPath = path.resolve(process.cwd(), 'src/app/globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    assert.match(
      cssContent,
      /\*:focus-visible\s*\{\s*outline:\s*2px solid/i,
      'globals.css must define visible 2px outline for *:focus-visible'
    );
    assert.match(
      cssContent,
      /outline-offset:\s*2px/i,
      'focus-visible must include outline-offset to stay cleanly separated from element border'
    );
  });
});
