import express from "express";

import {

  createBranch,
  getBranches,
  getBranchById,
  getBranchDashboard,
  updateBranch,
  deleteBranch,
  assignManager

} from "../controllers/branchController.js";

import {
  protect
} from "../middleware/authMiddleware.js";

import {
  authorize
} from "../middleware/roleMiddleware.js";

const router =
  express.Router();

/*
|--------------------------------------------------------------------------
| CREATE BRANCH
|--------------------------------------------------------------------------
*/

router.post(
  "/",

  protect,

  authorize(
    "ADMIN",
    "HQ_MANAGER"
  ),

  createBranch
);

/*
|--------------------------------------------------------------------------
| GET ALL BRANCHES
|--------------------------------------------------------------------------
| Customers should be able to VIEW branches
| so they can select reservation locations
|--------------------------------------------------------------------------
*/

router.get(
  "/",

  protect,

  getBranches
);

/*
|--------------------------------------------------------------------------
| GET SINGLE BRANCH
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",

  protect,

  authorize(

    "ADMIN",
    "HQ_MANAGER",
    "BRANCH_MANAGER"

  ),

  getBranchById
);

router.get(
  "/:id/dashboard",

  protect,

  authorize(

    "ADMIN",
    "HQ_MANAGER",
    "BRANCH_MANAGER"

  ),

  getBranchDashboard
);

/*
|--------------------------------------------------------------------------
| UPDATE BRANCH
|--------------------------------------------------------------------------
*/

router.put(
  "/:id",

  protect,

  authorize(
    "ADMIN",
    "HQ_MANAGER"
  ),

  updateBranch
);

/*
|--------------------------------------------------------------------------
| DELETE BRANCH
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",

  protect,

  authorize(
    "ADMIN"
  ),

  deleteBranch
);

/*
|--------------------------------------------------------------------------
| ASSIGN BRANCH MANAGER
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/assign-manager",

  protect,

  authorize(
    "ADMIN"
  ),

  assignManager
);

export default router;