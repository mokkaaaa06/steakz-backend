import { z } from "zod";
export const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum([
        "CUSTOMER",
        "CHEF",
        "BRANCH_MANAGER",
        "HQ_MANAGER",
        "ADMIN"
    ]),
    branchId: z.string().optional()
});
export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});
export const updateUserSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    role: z.enum([
        "CUSTOMER",
        "CHEF",
        "BRANCH_MANAGER",
        "HQ_MANAGER",
        "ADMIN"
    ]).optional(),
    branchId: z.string().optional()
});
//# sourceMappingURL=authValidation.js.map