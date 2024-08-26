import express from 'express';
import { pageAttributeList, createPageAttributes, updateStatus, UpdatePageAttribute, updatePageAttributeData } from '../controllers/pageAttributesController.js';
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.get('/page-attribute-list', protect, pageAttributeList);
router.post('/create-page-attributes', protect, createPageAttributes);
router.put('/update-status/:id', protect, updateStatus);
router.get('/update-page-attributes/:id', protect, UpdatePageAttribute);
router.put('/update-page-attributes/:id', protect, updatePageAttributeData);

export default router;
