import express from "express";
import prisma from "../config/prisma.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
const router = express.Router();
router.get("/admin", protect, authorize("ADMIN"), async (_req, res) => {
    try {
        const totalUsers = await prisma.user.count();
        const totalBranches = await prisma.branch.count();
        const totalReservations = await prisma.reservation.count();
        const pendingReservations = await prisma.reservation.count({
            where: {
                status: "PENDING"
            }
        });
        const confirmedReservations = await prisma.reservation.count({
            where: {
                status: "CONFIRMED"
            }
        });
        res.status(200).json({
            message: "Admin Dashboard",
            analytics: {
                totalUsers,
                totalBranches,
                totalReservations,
                pendingReservations,
                confirmedReservations
            }
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
});
export default router;
//# sourceMappingURL=testRoutes.js.map