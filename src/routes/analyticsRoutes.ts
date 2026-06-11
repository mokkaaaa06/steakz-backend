import express from "express";

import {
  getAnalytics,
  getBranchAnalytics
} from "../controllers/analyticsController.js";

import {
  protect
} from "../middleware/authMiddleware.js";

import {
  authorize
} from "../middleware/roleMiddleware.js";

const router =
  express.Router();

router.get(
  "/branch/:branchId",
  getBranchAnalytics
);

router.get(
  "/",

  protect,

  authorize(
    "ADMIN",
    "HQ_MANAGER"
  ),

  getAnalytics
);

export default router;