import express from 'express';
import { pageList, createPage, updatePage, updatePageData, updateStatus, pageListData } from '../controllers/pageController.js';
import { protect } from '../middleware/authMiddleware.js'; // Import the protect middleware

const router = express.Router();

// Apply protect middleware to routes that require authentication
router.get('/page-list', protect, pageList);
router.get('/page-list-data', protect, pageListData);
router.post('/create-page', protect, createPage);
router.get('/update-page/:id', protect, updatePage);
router.put('/update-page-data/:id', protect, updatePageData);
router.put('/update-status/:id', protect, updateStatus);

export default router;
