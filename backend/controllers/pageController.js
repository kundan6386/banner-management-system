import asyncHandler from "express-async-handler";
import Page from "../models/pageModel.js";
import { saveActivity } from './logController.js';


    const pageList = asyncHandler(async (req, res) => {
      const { platform } = req.query;
      let query = { status: 'active' };

      if (platform) {
        query.platform = platform;
      }

      const pages = await Page.find(query);

      res.json(pages);
    });

    const pageListData = asyncHandler(async (req, res) => {
      const pages = await Page.find();
      res.json(pages);
    });
  
  
  const createPage = asyncHandler(async (req, res) => {
    const { pageName, status, platform, pageURL } = req.body;
    const existingPage = await Page.findOne({ pageName, platform });
    if (existingPage) {
      return res.status(400).json({ error: 'Page with the same name and platform already exists.' });
    }
  
    const newPage = new Page({
      pageName,
      status,
      platform,
      pageURL,
    });
  
    try {
      const savedPage = await newPage.save();
      const currentUser = req.user;
      await saveActivity(currentUser._id, 'page', savedPage._id, `${currentUser.name} created ${savedPage.pageName} Page`);
      res.status(201).json(savedPage);
    } catch (error) {
      res.status(500).json({ message: 'Failed to save the page', error: error.message });
    }
  });
  

  const updatePage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const page = await Page.findById(id);
    if (page) {
      res.json(page);
    } else {
      res.status(404).json({ message: 'Page not found' });
    }
  });
  
  const updatePageData = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
      pageName,
      status,
      platform,
      pageURL
    } = req.body;
  
    const page = await Page.findById(id);
    const prevPlatform = page.platform;
    const prevPageURL = page.pageURL;

   
    if (page) {
      page.pageName = pageName || page.pageName;
      page.status = status || page.status;
      page.platform = platform || page.platform;
      page.pageURL = pageURL || page.pageURL;
      
      const updatedPage = await page.save();
      const currentUser = req.user;
      
      if (platform !== prevPlatform) {
        await saveActivity(currentUser._id, 'page', updatedPage._id, `${currentUser.name} updated platform from ${prevPlatform} to ${platform}`);
      }

      if (pageURL !== prevPageURL) {
        await saveActivity(currentUser._id, 'page', updatedPage._id, `${currentUser.name} updated page URL from ${prevPageURL} to ${pageURL}`);
      }

      res.json(updatedPage);
    
    } else {
      res.status(404).json({ message: 'Page not found' });
    }
  });

  const updateStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    const pages = await Page.findById(id);
    const prevStaus = pages.status;
    if (pages) {
      pages.status = status;
      const updatedPages = await pages.save();
      const currentUser = req.user;
      await saveActivity(currentUser._id, 'page', updatedPages._id, `${currentUser.name} updated status from ${prevStaus} to  ${pages.status}`);
      res.json(updatedPages);
    } else {
      res.status(404).json({ message: 'Page attribute not found' });
    }
  });
  

  export {
    pageList,
    createPage,
    updatePage,
    updatePageData,
    saveActivity,
    updateStatus,
    pageListData
    
  };