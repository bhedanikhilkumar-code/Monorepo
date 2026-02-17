export const MIN = new Date('2000-01-01T00:00:00.000Z');
export const MAX = new Date('2099-12-31T23:59:59.999Z');
export function validateRange(date: Date) { return date >= MIN && date <= MAX; }
