import express from "express";
import { createShift, getChefs, getChefShifts, getAllShifts } from "../controllers/shiftController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
const router = express.Router();
router.post("/", protect, authorize("ADMIN", "BRANCH_MANAGER"), createShift);
router.get("/all", protect, authorize("ADMIN", "BRANCH_MANAGER"), getAllShifts);
router.get("/chefs", protect, authorize("ADMIN", "BRANCH_MANAGER"), getChefs);
router.get("/:chefId", protect, authorize("ADMIN", "HQ_MANAGER", "BRANCH_MANAGER", "CHEF"), getChefShifts);
export default router;
//# sourceMappingURL=shiftRoutes.js.map