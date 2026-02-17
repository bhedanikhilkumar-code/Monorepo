export const MIN_DATE = new Date('2000-01-01T00:00:00.000Z');
export const MAX_DATE = new Date('2099-12-31T23:59:59.999Z');

export function assertDateInRange(date: Date, fieldName: string) {
  if (Number.isNaN(date.getTime()) || date < MIN_DATE || date > MAX_DATE) {
    throw new Error(`${fieldName} must be between 2000-01-01 and 2099-12-31.`);
  }
}
