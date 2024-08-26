import asyncHandler from "express-async-handler";
import Banner from "../models/bannerModel.js";
import Page from "../models/pageModel.js";
import { saveActivity } from './logController.js';


const createBanner = asyncHandler(async (req, res) => {
  const { title, position, startDate, endDate, status, platform, imageURL, bannerClass, placement, page, lang } =
    req.body;

  if (
    !title ||
    !startDate ||
    !platform ||
    !req.files.desktopImage ||
    !req.files.mobileImage
  ) {
    return res.status(400).json({
      error: "All fields including desktopImage and mobileImage are required",
    });
  }

  let langValue = lang || 'all';

  const { desktopImage, mobileImage } = req.files;

  try {
    const desktopImageURL = desktopImage[0].location;
    const mobileImageURL = mobileImage[0].location;

    const newBanner = new Banner({
      title,
      startDate,
      endDate,
      platform,
      desktopImage: desktopImageURL,
      mobileImage: mobileImageURL,
      imageURL,
      bannerClass,
      page,
      position,
      lang: langValue, // Use the validated langValue
      placement,
    });

    const savedBanner = await newBanner.save();
    const currentUser = req.user;

    await saveActivity(currentUser._id, 'banner', savedBanner._id, `${currentUser.name} added banner with title ${savedBanner.title}`);
    res.status(201).json(savedBanner);

  } catch (error) {
    console.error("Error creating banner:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const bannerList = asyncHandler(async (req, res) => {
  try {
    const { platform, status } = req.query;
    let query = {};

    if (platform) {
      query.platform = platform;
    }

    if (status) {
      query.status = status;
    } else {
      query.status = { $in: ['active', 'inactive'] };
    }

    const banners = await Banner.find(query)
      .populate('page', 'pageName');
    if (banners.length === 0) {
      return res.status(404).json({ message: "No banners found" });
    }

    res.json(banners);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


const updateBannerStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const banner = await Banner.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    const currentUser = req.user;
    await saveActivity(currentUser._id, 'banner', banner._id, `${currentUser.name} changed ${banner.title} Banner status ${banner.status}`);
    if (!banner) {
      return res.status(404).json({ error: "Banner not found" });
    }
    res.json(banner);
  } catch (error) {
    console.error("Error updating banner status:", error);
    res.status(500).json({ error: "Failed to update banner status" });
  }
});

const updateBannerData = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, position, startDate, endDate, status, platform, lang, imageURL, bannerClass, page, placement } =
    req.body;

  
  const formattedStartDate = new Date(startDate);
  const formattedEndDate = endDate ? new Date(endDate) : null;

  try {
    let banner = await Banner.findById(id);

   

    if (!banner) {
      res.status(404).json({ error: "Banner not found" });
      return;
    }

    const prevTitle = banner.title;
    const prevBannerClass = banner.bannerClass;
    const prevImageURL = banner.imageURL;
    const prevStartDate = banner.startDate;
    const prevEndDate = banner.endDate;
    const prevPlatform = banner.platform;
    const prevDesktopImage = banner.desktopImage;
    const prevMobileImage = banner.mobileImage;
    

    banner.title = title;

    if (position !== "null" && position !== null) {
      banner.position = parseInt(position, 10);
    }

    if (endDate !== "null" && endDate !== null) {
      banner.endDate = formattedEndDate;
    }

    banner.startDate = formattedStartDate;
    banner.status = status;
    banner.platform = platform;
    banner.lang = lang;
    banner.imageURL = imageURL;
    banner.bannerClass = bannerClass;
    banner.page = page;
    banner.placement = placement;

    if (req.files && (req.files.desktopImage || req.files.mobileImage)) {
      const { desktopImage, mobileImage } = req.files;
      if (desktopImage && desktopImage.length > 0) {
        banner.desktopImage = desktopImage[0].location; // AWS S3 URL
      }

      if (mobileImage && mobileImage.length > 0) {
        banner.mobileImage = mobileImage[0].location; // AWS S3 URL
      }
    }

    banner = await banner.save();
    const currentUser = req.user;

    if (title !== prevTitle) {
      await saveActivity(currentUser._id, 'banner', banner._id, `${currentUser.name}  updated title from ${prevTitle} to ${title} `);
      res.status(200).json(banner);
    }

    if (bannerClass !== prevBannerClass) {
      await saveActivity(currentUser._id, 'banner', banner._id, `${currentUser.name}  updated placement class from ${prevBannerClass} to ${bannerClass} `);
      res.status(200).json(banner);
    }

    if (bannerClass !== prevImageURL) {
      await saveActivity(currentUser._id, 'banner', banner._id, `${currentUser.name}  updated action URL from  ${prevImageURL} to ${imageURL} `);
      res.status(200).json(banner);
    }

    if (startDate !== prevStartDate) {
      await saveActivity(currentUser._id, 'banner', banner._id, `${currentUser.name}  updated start date from  ${prevStartDate} to ${startDate} `);
      res.status(200).json(banner);
    }

    if (endDate !== prevEndDate) {
      await saveActivity(currentUser._id, 'banner', banner._id, `${currentUser.name}  updated End date from  ${prevEndDate} to ${endDate} `);
      res.status(200).json(banner);
    }
     
     
    if (platform !== prevPlatform) {
      await saveActivity(currentUser._id, 'banner', banner._id, `${currentUser.name} updated platform from ${prevPlatform} to ${platform}`);
    }

    if (desktopImage !== prevDesktopImage) {
      await saveActivity(currentUser._id, 'banner', banner._id, `${currentUser.name} updated Desktop Image from ${prevDesktopImage} to ${desktopImage}`);
    }

    if (mobileImage !== prevMobileImage) {
      await saveActivity(currentUser._id, 'banner', banner._id, `${currentUser.name} updated Mobile Image from ${prevMobileImage} to ${mobileImage}`);
    }

  } catch (error) {
    console.error("Error updating banner:", error);
    res.status(500).json({ error: "Failed to update banner" });
  }
});



const updateBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ error: "Banner not found" });
    }

    res.status(200).json(banner); // Send the banner data as response
  } catch (error) {
    console.error("Error fetching banner:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


const getBanners = async (req, res) => {
  try {
    const { platform, pageName, placement } = req.query;

    if (!platform) {
      return res.status(400).json({ error: 'Platform is required' });
    }
    if (!pageName) {
      return res.status(400).json({ error: 'Page name is required' });
    }
    if (!placement) {
      return res.status(400).json({ error: 'Placement is required' });
    }

    const page = await Page.findOne({ pageName: pageName, platform: platform });

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    const currentDate = new Date().toISOString();
    const banners = await Banner.find({
      status: 'active',
      platform: platform,
      placement: placement,
      page: page._id,
      startDate: { $lte: currentDate },
      $or: [
        { endDate: { $exists: false } },
        { endDate: { $gte: currentDate } },
        { endDate: "" },
      ],
    });

    res.json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export {
  createBanner,
  bannerList,
  updateBannerStatus,
  updateBannerData,
  updateBanner,
  getBanners,
};
