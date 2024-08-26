import express from 'express';
import { createBanner, updateBanner, updateBannerData, bannerList, updateBannerStatus, getBanners } from '../controllers/bannerController.js';
import { upload } from '../middleware/multerMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/createbanner', protect, upload.fields([{ name: 'desktopImage', maxCount: 1 }, { name: 'mobileImage', maxCount: 1 }]), createBanner);
router.put('/update-banner-data/:id', protect, upload.fields([{ name: 'desktopImage', maxCount: 1 }, { name: 'mobileImage', maxCount: 1 }]), updateBannerData); // Use upload.fields() middleware for updating images
router.get('/banner-list', protect, bannerList);
router.put('/update-banner-status/:id', protect, updateBannerStatus);
router.get('/update-banner/:id', protect, updateBanner);
router.get('/get-banners', getBanners);

export default router;
export { upload };
