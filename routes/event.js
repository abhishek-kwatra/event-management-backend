import express from 'express';
import {
  createEvent,
  getEventById,
  updateEventById
} from '../controller/eventController.js';

const router = express.Router();

router.post('/events', createEvent);       
router.get('/events/:id', getEventById);  
router.patch('/events/:id', updateEventById); 

export default router;
