import express
from "express";

import {

  createMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem

} from "../controllers/menuController.js";

const router =
  express.Router();

router.get(
  "/",
  getMenuItems
);

router.post(
  "/",
  createMenuItem
);

router.put(
  "/:id",
  updateMenuItem
);

router.delete(
  "/:id",
  deleteMenuItem
);

export default router;