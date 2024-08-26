import express from 'express';
import { saveActivity, getActivity } from '../controllers/logController.js';

const router = express.Router();


// Route to save activity
router.post('/activity', saveActivity);
router.get('/get-activity/:id', getActivity);

export default router;
