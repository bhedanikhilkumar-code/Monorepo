import { describe, expect, it } from 'vitest';
import { validateRange } from './dateRange';

describe('date range', () => {
  it('accepts minimum', () => expect(validateRange(new Date('2000-01-01T00:00:00.000Z'))).toBe(true));
  it('accepts maximum', () => expect(validateRange(new Date('2099-12-31T23:59:59.999Z'))).toBe(true));
  it('rejects before min', () => expect(validateRange(new Date('1999-12-31T23:59:59.999Z'))).toBe(false));
  it('rejects after max', () => expect(validateRange(new Date('2100-01-01T00:00:00.000Z'))).toBe(false));
});
