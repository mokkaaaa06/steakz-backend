import express from "express";
import { register, login, getUsers, createUser, updateUser, deleteUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
const router = express.Router();
/**
 * @swagger
 * /api/auth/register-customer:
 *   post:
 *     summary: Register a new customer
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 example: CUSTOMER
 *     responses:
 *       201:
 *         description:
 *           Customer registered successfully
 */
router.post("/register-customer", register);
/**
 * @swagger
 * /api/auth/login-customer:
 *   post:
 *     summary: Login customer
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description:
 *           Customer login successful
 */
router.post("/login-customer", login);
router.post("/register-admin", register);
router.post("/login-admin", login);
router.post("/register-branch-manager", register);
router.post("/login-branch-manager", login);
router.post("/register-hq-manager", register);
router.post("/login-hq-manager", login);
router.post("/register-chef", register);
router.post("/login-chef", login);
router.get("/users", protect, authorize("ADMIN"), getUsers);
router.post("/users", protect, authorize("ADMIN"), createUser);
router.put("/users/:id", protect, authorize("ADMIN"), updateUser);
router.delete("/users/:id", protect, authorize("ADMIN"), deleteUser);
export default router;
//# sourceMappingURL=authRoutes.js.map