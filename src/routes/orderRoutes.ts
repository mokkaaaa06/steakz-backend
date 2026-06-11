import express from "express";

import {

  getChefOrders,

  updateOrderStatus

} from "../controllers/orderController.js";

import {

  protect

} from "../middleware/authMiddleware.js";

import {

  authorize

} from "../middleware/roleMiddleware.js";

const router =
  express.Router();

router.get(

  "/chef",

  protect,

  authorize(
    "CHEF"
  ),

  getChefOrders
);

router.patch(

  "/:id/status",

  protect,

  authorize(
    "CHEF"
  ),

  updateOrderStatus
);

export default router;