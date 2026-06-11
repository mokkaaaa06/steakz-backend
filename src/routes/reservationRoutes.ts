import express from "express";

import {

  createReservation,

  getMyReservations,

  getBranchReservations,

  getAllReservations,

  updateReservationStatus,

  cancelReservation

} from "../controllers/reservationController.js";

import {

  protect

} from "../middleware/authMiddleware.js";

import {

  authorize

} from "../middleware/roleMiddleware.js";

const router =
  express.Router();

router.post(

  "/",

  protect,

  authorize(
    "CUSTOMER"
  ),

  createReservation
);

router.get(

  "/my",

  protect,

  authorize(
    "CUSTOMER"
  ),

  getMyReservations
);

router.get(

  "/all",

  protect,

  authorize(

    "ADMIN",

    "HQ_MANAGER"
  ),

  getAllReservations
);

router.get(

  "/branch/:branchId",

  protect,

  authorize(

    "BRANCH_MANAGER",

    "HQ_MANAGER",

    "ADMIN",

    "CHEF"
  ),

  getBranchReservations
);

router.patch(

  "/:id/status",

  protect,

  authorize(
    "CHEF"
  ),

  updateReservationStatus
);

router.put(

  "/cancel/:id",

  protect,

  authorize(
    "CUSTOMER"
  ),

  cancelReservation
);

export default router;
