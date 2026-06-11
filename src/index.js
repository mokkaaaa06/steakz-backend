import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import menuRoutes from "./routes/menuRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import branchRoutes from "./routes/branchRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import shiftRoutes from "./routes/shiftRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (_req, res) => {
    res.json({
        success: true,
        message: "Steakz MIS Backend Running"
    });
});
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/menu", menuRoutes);
app.use("/api/shifts", shiftRoutes);
app.use("/api/orders", orderRoutes);
//# sourceMappingURL=index.js.map