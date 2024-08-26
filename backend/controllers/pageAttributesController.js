import asyncHandler from "express-async-handler";
import PageAttributes from "../models/pageAttributesModel.js";
import Page from "../models/pageModel.js";
import { saveActivity } from './logController.js';

const pageAttributeList = asyncHandler(async (req, res) => {
  const { platform, page_id } = req.query;
  let query = { status: 'active' };

  if (platform) {
    query.platform = platform;
  }

  if (page_id) {
    query.page_id = page_id;
  }

  const pages_attributes = await PageAttributes.find(query).populate({
    path: 'page_id',
    select: 'pageName',
  });

  res.json(pages_attributes);
});

const createPageAttributes = asyncHandler(async (req, res) => {
  const { platform, page_id, page_placement, placement_width, placement_height, mobile_placement_width, mobile_placement_height } = req.body;
  const existingPage = await PageAttributes.findOne({ page_id, page_placement });
  if (existingPage) {
    return res.status(400).json({ error: 'Page Attributes with the same name and page already exists.' });
  }

  const newPageAttributes = new PageAttributes({
    platform,
    page_id,
    page_placement,
    placement_width,
    placement_height,
    mobile_placement_width,
    mobile_placement_height,
  });

  try {
    const savedPageAttributes = await newPageAttributes.save();
    const currentUser = req.user;

    await saveActivity(currentUser._id, 'pageAttribute', savedPageAttributes._id, `${currentUser.name} added page attribute ${savedPageAttributes.page_placement} page`);

    res.status(201).json(savedPageAttributes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save the page attributes', error: error.message });
  }
});

const updateStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const attribute = await PageAttributes.findById(id);

  if (attribute) {
    attribute.status = status;
    const updatedAttribute = await attribute.save();
    const currentUser = req.user;
    await saveActivity(currentUser._id, 'pageAttribute', updatedAttribute._id, `${currentUser.name} changes ${updatedAttribute.page_placement} placement status ${updatedAttribute.status}`);
    res.json(updatedAttribute);
  } else {
    res.status(404).json({ message: 'Page attribute not found' });
  }
});

const UpdatePageAttribute = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const attribute = await PageAttributes.findById(id);
  if (attribute) {
    res.json(attribute);
  } else {
    res.status(404).json({ message: 'Page attribute not found' });
  }
});

const updatePageAttributeData = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    platform,
    page_id,
    page_placement,
    placement_width,
    placement_height,
    mobile_placement_width,
    mobile_placement_height,
  } = req.body;

  const attribute = await PageAttributes.findById(id);

  const prevDesktopWidth = attribute.placement_width;
  const prevDesktopHeight = attribute.placement_height;

  
  const prevMobileWidth = attribute.mobile_placement_width;
  const prevMobileHeight = attribute.mobile_placement_height;

  const prevPlatform = attribute.platform;
  const prevPagePlacement = attribute.page_placement;

  const prev_page = await Page.findOne({ _id: attribute.page_id });
  const prevPageName = prev_page.pageName;

  const current_page = await Page.findOne({ _id: page_id });
  const currentPageName = current_page.pageName;

  if (attribute) {
    attribute.platform = platform;
    attribute.page_id = page_id;
    attribute.page_placement = page_placement;
    attribute.placement_width = placement_width;
    attribute.placement_height = placement_height;
    attribute.mobile_placement_width = mobile_placement_width;
    attribute.mobile_placement_height = mobile_placement_height;

    const updatedAttribute = await attribute.save();
    const currentUser = req.user;
     
    if (platform !== prevPlatform) {
      await saveActivity(currentUser._id, 'pageAttribute', updatedAttribute._id, `${currentUser.name} updated platform from ${prevPlatform} to ${platform}`);
    }

    if (currentPageName !== prevPageName) {
      await saveActivity(currentUser._id, 'pageAttribute', updatedAttribute._id, `${currentUser.name} updated page from ${prevPageName} to ${currentPageName}`);
    }
    
    if (page_placement !== prevPagePlacement) {
      await saveActivity(currentUser._id, 'pageAttribute', updatedAttribute._id, `${currentUser.name} updated page placement from ${prevPagePlacement} to ${page_placement}`);
    }

    if (placement_width !== prevDesktopWidth) {
      await saveActivity(currentUser._id, 'pageAttribute', updatedAttribute._id, `${currentUser.name} updated Desktop Placement Width from  ${prevDesktopWidth} to ${placement_width}`);
    }

    if (placement_height !== prevDesktopHeight) {
      await saveActivity(currentUser._id, 'pageAttribute', updatedAttribute._id, `${currentUser.name} updated Desktop Placement Height from  ${prevDesktopHeight} to ${placement_height}`);
    }

    if (mobile_placement_width !== prevMobileWidth) {
      await saveActivity(currentUser._id, 'pageAttribute', updatedAttribute._id, `${currentUser.name} updated Mobile Placement Width from  ${prevMobileWidth} to ${mobile_placement_width}`);
    }

    if (mobile_placement_height !== prevMobileHeight) {
      await saveActivity(currentUser._id, 'pageAttribute', updatedAttribute._id, `${currentUser.name} updated Mobile Placement Height from  ${prevMobileHeight} to ${mobile_placement_height}`);
    }

    res.json(updatedAttribute);
  
  } else {
    res.status(404).json({ message: 'Page attribute not found' });
  }

});



export {
  pageAttributeList,
  createPageAttributes,
  updateStatus,
  UpdatePageAttribute,
  updatePageAttributeData
};
