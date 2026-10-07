import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  checkRateLimit,
  clearRateLimitStore,
  getRateLimitHeaders
} from '../src/lib/rate-limit';

describe('Phase 9 Rate Limiter & Abuse Prevention', () => {
  beforeEach(() => {
    clearRateLimitStore();
  });

  test('permits requests within configured threshold', () => {
    const id = 'test_ip_1';
    const r1 = checkRateLimit(id, { limit: 5, windowMs: 10000 });
    assert.strictEqual(r1.allowed, true);
    assert.strictEqual(r1.remaining, 4);

    const r2 = checkRateLimit(id, { limit: 5, windowMs: 10000 });
    assert.strictEqual(r2.allowed, true);
    assert.strictEqual(r2.remaining, 3);
  });

  test('blocks requests when threshold is exceeded', () => {
    const id = 'test_ip_blocked';
    for (let i = 0; i < 3; i++) {
      const res = checkRateLimit(id, { limit: 3, windowMs: 10000 });
      assert.strictEqual(res.allowed, true);
    }

    // 4th request must be denied
    const blocked = checkRateLimit(id, { limit: 3, windowMs: 10000 });
    assert.strictEqual(blocked.allowed, false);
    assert.strictEqual(blocked.remaining, 0);
  });

  test('generates correct rate limit response headers', () => {
    const res = checkRateLimit('header_test', { limit: 10, windowMs: 60000 });
    const headers = getRateLimitHeaders(res);

    assert.strictEqual(headers['X-RateLimit-Limit'], '10');
    assert.strictEqual(headers['X-RateLimit-Remaining'], '9');
    assert.ok(Number(headers['X-RateLimit-Reset']) > 0);
  });
});
