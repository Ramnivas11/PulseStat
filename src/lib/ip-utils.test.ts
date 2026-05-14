import test from 'node:test';
import assert from 'node:assert';
import { getIp } from './ip-utils.ts';

test('getIp returns first IP from x-forwarded-for', () => {
  const req = new Request('http://localhost', {
    headers: {
      'x-forwarded-for': '1.2.3.4, 5.6.7.8'
    }
  });
  assert.strictEqual(getIp(req), '1.2.3.4');
});

test('getIp returns trimmed x-forwarded-for', () => {
  const req = new Request('http://localhost', {
    headers: {
      'x-forwarded-for': '  2.3.4.5  '
    }
  });
  assert.strictEqual(getIp(req), '2.3.4.5');
});

test('getIp returns x-real-ip if x-forwarded-for is missing', () => {
  const req = new Request('http://localhost', {
    headers: {
      'x-real-ip': '9.8.7.6'
    }
  });
  assert.strictEqual(getIp(req), '9.8.7.6');
});

test('getIp returns 127.0.0.1 if no relevant headers are present', () => {
  const req = new Request('http://localhost');
  assert.strictEqual(getIp(req), '127.0.0.1');
});

test('getIp prefers x-forwarded-for over x-real-ip', () => {
  const req = new Request('http://localhost', {
    headers: {
      'x-forwarded-for': '1.1.1.1',
      'x-real-ip': '2.2.2.2'
    }
  });
  assert.strictEqual(getIp(req), '1.1.1.1');
});
