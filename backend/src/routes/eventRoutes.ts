import { Router } from 'express';
import {
  createEvent, deleteEvent, exportICS, getEvent, getOccurrences, importICS,
  listEvents, setRecurrence, updateEvent
} from '../controllers/eventController';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createEventSchema, idParamSchema, listEventsSchema, occurrencesSchema, recurrenceSchema, updateEventSchema } from '../schemas/events';

const router = Router();
router.use(requireAuth);
router.get('/', validate(listEventsSchema), listEvents);
router.post('/', validate(createEventSchema), createEvent);
router.get('/export/ics', exportICS);
router.post('/import/ics', importICS);
router.get('/:id', validate(idParamSchema), getEvent);
router.put('/:id', validate(updateEventSchema), updateEvent);
router.delete('/:id', validate(idParamSchema), deleteEvent);
router.post('/:id/recurrence', validate(recurrenceSchema), setRecurrence);
router.get('/:id/occurrences', validate(occurrencesSchema), getOccurrences);

export default router;
