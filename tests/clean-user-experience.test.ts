import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_NEW_USER_PROFILE, DEMO_SAMPLE_PROFILE } from '../src/lib/supabase/auth-context';
import { EMPTY_INITIAL_PLAN } from '../src/app/(dashboard)/today/page';

describe('Task 5: Clean New User Experience & Demo Isolation', () => {
  test('DEFAULT_NEW_USER_PROFILE starts with 0 streak and un-onboarded status', () => {
    assert.equal(DEFAULT_NEW_USER_PROFILE.streak_count, 0);
    assert.equal(DEFAULT_NEW_USER_PROFILE.is_onboarded, false);
    assert.equal(DEFAULT_NEW_USER_PROFILE.full_name, 'Aspirant');
    assert.equal(DEFAULT_NEW_USER_PROFILE.optional_subject, null);
  });

  test('EMPTY_INITIAL_PLAN has 0 tasks and 0 planned minutes', () => {
    assert.equal(EMPTY_INITIAL_PLAN.tasks.length, 0);
    assert.equal(EMPTY_INITIAL_PLAN.totalPlannedMinutes, 0);
    assert.equal(EMPTY_INITIAL_PLAN.totalCompletedMinutes, 0);
    assert.equal(EMPTY_INITIAL_PLAN.status, 'proposed');
    assert.ok(EMPTY_INITIAL_PLAN.mentorRationale.includes('morning check-in'));
  });

  test('Demo data is isolated to DEMO_SAMPLE_PROFILE', () => {
    assert.notEqual(DEFAULT_NEW_USER_PROFILE.id, DEMO_SAMPLE_PROFILE.id);
    assert.equal(DEMO_SAMPLE_PROFILE.streak_count, 14);
    assert.equal(DEMO_SAMPLE_PROFILE.full_name, 'Aditya Sharma');
    assert.equal(DEMO_SAMPLE_PROFILE.is_onboarded, true);
  });
});
