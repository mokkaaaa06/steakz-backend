import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";
import { generateToken } from "../utils/jwt.js";
import { registerSchema, loginSchema, updateUserSchema } from "../validations/authValidation.js";
export const register = async (req, res) => {
    try {
        const validatedData = registerSchema.parse(req.body);
        const { name, email, password, role, branchId } = validatedData;
        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (existingUser) {
            res.status(400).json({
                message: "User already exists"
            });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.$transaction(async (tx) => {
            const createdUser = await tx.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role,
                    branchId: branchId || null
                },
                include: {
                    branch: true
                }
            });
            if (role === "CUSTOMER") {
                await tx.customer.create({
                    data: {
                        userId: createdUser.id
                    }
                });
            }
            if (role === "CHEF") {
                await tx.chef.create({
                    data: {
                        userId: createdUser.id
                    }
                });
            }
            if (role === "BRANCH_MANAGER") {
                await tx.branchManager.create({
                    data: {
                        userId: createdUser.id
                    }
                });
            }
            if (role === "HQ_MANAGER") {
                await tx.hqManager.create({
                    data: {
                        userId: createdUser.id
                    }
                });
            }
            if (role === "ADMIN") {
                await tx.admin.create({
                    data: {
                        userId: createdUser.id
                    }
                });
            }
            return createdUser;
        });
        const token = generateToken(user.id, user.role, user.branchId);
        const safeUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            branchId: user.branchId,
            branchName: user.branch?.name || null,
            createdAt: user.createdAt
        };
        res.status(201).json({
            message: "User registered successfully",
            token,
            user: safeUser
        });
    }
    catch (error) {
        console.log(error);
        if (error.name === "ZodError") {
            res.status(400).json({
                message: "Validation failed",
                errors: error.issues.map((issue) => issue.message)
            });
            return;
        }
        res.status(500).json({
            message: "Server error"
        });
    }
};
export const login = async (req, res) => {
    try {
        const validatedData = loginSchema.parse(req.body);
        const { email, password } = validatedData;
        const user = await prisma.user.findUnique({
            where: {
                email
            },
            include: {
                branch: true
            }
        });
        if (!user) {
            res.status(400).json({
                message: "Invalid credentials"
            });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({
                message: "Invalid credentials"
            });
            return;
        }
        const token = generateToken(user.id, user.role, user.branchId);
        const safeUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            branchId: user.branchId,
            branchName: user.branch?.name || null,
            createdAt: user.createdAt
        };
        res.status(200).json({
            message: "Login successful",
            token,
            user: safeUser
        });
    }
    catch (error) {
        console.log(error);
        if (error.name === "ZodError") {
            res.status(400).json({
                message: "Validation failed",
                errors: error.issues.map((issue) => issue.message)
            });
            return;
        }
        res.status(500).json({
            message: "Server error"
        });
    }
};
export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                branchId: true,
                branch: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                createdAt: true
            }
        });
        res.status(200).json(users);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};
export const createUser = async (req, res) => {
    try {
        const validatedData = registerSchema.parse(req.body);
        const { name, email, password, role, branchId } = validatedData;
        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (existingUser) {
            res.status(400).json({
                message: "User already exists"
            });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                branchId: branchId || null
            },
            include: {
                branch: true
            }
        });
        const safeUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            branchId: user.branchId,
            branchName: user.branch?.name || null,
            createdAt: user.createdAt
        };
        res.status(201).json({
            message: "User created successfully",
            user: safeUser
        });
    }
    catch (error) {
        console.log(error);
        if (error.name === "ZodError") {
            res.status(400).json({
                message: "Validation failed",
                errors: error.issues.map((issue) => issue.message)
            });
            return;
        }
        res.status(500).json({
            message: "Server error"
        });
    }
};
export const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const validatedData = updateUserSchema.parse(req.body);
        if (validatedData.email) {
            const existingUser = await prisma.user.findUnique({
                where: {
                    email: validatedData.email
                }
            });
            if (existingUser &&
                existingUser.id !== id) {
                res.status(400).json({
                    message: "Email is already in use"
                });
                return;
            }
        }
        const user = await prisma.user.findUnique({
            where: {
                id
            }
        });
        if (!user) {
            res.status(404).json({
                message: "User not found"
            });
            return;
        }
        const updateData = {
            ...validatedData
        };
        if (validatedData.password) {
            updateData.password =
                await bcrypt.hash(validatedData.password, 10);
        }
        const updatedUser = await prisma.user.update({
            where: {
                id
            },
            data: updateData,
            include: {
                branch: true
            }
        });
        const safeUser = {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            branchId: updatedUser.branchId,
            branchName: updatedUser.branch?.name || null,
            createdAt: updatedUser.createdAt
        };
        res.status(200).json({
            message: "User updated successfully",
            user: safeUser
        });
    }
    catch (error) {
        console.log(error);
        if (error.name === "ZodError") {
            res.status(400).json({
                message: "Validation failed",
                errors: error.issues.map((issue) => issue.message)
            });
            return;
        }
        res.status(500).json({
            message: "Server error"
        });
    }
};
export const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await prisma.user.findUnique({
            where: {
                id
            },
            include: {
                orders: true,
                reservations: true,
                chefShifts: true,
                managedBranch: true
            }
        });
        if (!user) {
            res.status(404).json({
                message: "User not found"
            });
            return;
        }
        if (user.managedBranch) {
            await prisma.branch.update({
                where: {
                    id: user.managedBranch.id
                },
                data: {
                    managerId: null
                }
            });
        }
        if (user.orders.length > 0) {
            const orderIds = user.orders.map((order) => order.id);
            await prisma.orderItem.deleteMany({
                where: {
                    orderId: {
                        in: orderIds
                    }
                }
            });
            await prisma.order.deleteMany({
                where: {
                    id: {
                        in: orderIds
                    }
                }
            });
        }
        if (user.reservations.length > 0) {
            await prisma.reservation.deleteMany({
                where: {
                    customerId: id
                }
            });
        }
        if (user.chefShifts.length > 0) {
            await prisma.chefShift.deleteMany({
                where: {
                    chefId: id
                }
            });
        }
        await prisma.user.delete({
            where: {
                id
            }
        });
        res.status(200).json({
            message: "User deleted successfully"
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};
//# sourceMappingURL=authController.js.map