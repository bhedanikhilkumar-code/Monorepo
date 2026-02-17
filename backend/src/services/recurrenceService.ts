import { EventRecurrence } from '@prisma/client';
import { RRule } from 'rrule';

export function buildRRule(baseStart: Date, recurrence: EventRecurrence) {
  const freqMap: Record<string, number> = {
    DAILY: RRule.DAILY,
    WEEKLY: RRule.WEEKLY,
    MONTHLY: RRule.MONTHLY,
    YEARLY: RRule.YEARLY
  };
  return new RRule({
    freq: freqMap[recurrence.freq],
    interval: recurrence.interval,
    dtstart: baseStart,
    byweekday: recurrence.byWeekday?.split(',').map((d) => RRule[d as keyof typeof RRule] as any),
    bymonthday: recurrence.byMonthday ?? undefined,
    count: recurrence.count ?? undefined,
    until: recurrence.until ?? undefined
  });
}
