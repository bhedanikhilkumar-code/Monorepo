import ical from 'ical-generator';
import { assertDateInRange } from '../utils/dateRange';

export function generateICS(events: Array<{ title: string; description?: string | null; startAt: Date; endAt: Date; location?: string | null }>) {
  const calendar = ical({ name: 'Calendar Export' });
  events.forEach((event) => {
    assertDateInRange(event.startAt, 'event start');
    assertDateInRange(event.endAt, 'event end');
    calendar.createEvent({
      start: event.startAt,
      end: event.endAt,
      summary: event.title,
      description: event.description || undefined,
      location: event.location || undefined
    });
  });
  return calendar.toString();
}

export function parseSimpleICS(input: string) {
  const items = input.split('BEGIN:VEVENT').slice(1).map((chunk) => chunk.split('END:VEVENT')[0]);
  return items.map((entry) => {
    const lines = entry.split('\n').map((l) => l.trim());
    const title = lines.find((l) => l.startsWith('SUMMARY:'))?.replace('SUMMARY:', '') || 'Imported event';
    const dtStartRaw = lines.find((l) => l.startsWith('DTSTART:'))?.replace('DTSTART:', '');
    const dtEndRaw = lines.find((l) => l.startsWith('DTEND:'))?.replace('DTEND:', '');
    if (!dtStartRaw || !dtEndRaw) {
      throw new Error('ICS item missing DTSTART/DTEND.');
    }
    const startAt = new Date(dtStartRaw.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, '$1-$2-$3T$4:$5:$6Z'));
    const endAt = new Date(dtEndRaw.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, '$1-$2-$3T$4:$5:$6Z'));
    assertDateInRange(startAt, 'ICS event start');
    assertDateInRange(endAt, 'ICS event end');
    return { title, startAt, endAt };
  });
}
