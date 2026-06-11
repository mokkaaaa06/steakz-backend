import { z } from "zod";
export declare const registerSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodEnum<{
        CUSTOMER: "CUSTOMER";
        CHEF: "CHEF";
        BRANCH_MANAGER: "BRANCH_MANAGER";
        HQ_MANAGER: "HQ_MANAGER";
        ADMIN: "ADMIN";
    }>;
    branchId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const updateUserSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<{
        CUSTOMER: "CUSTOMER";
        CHEF: "CHEF";
        BRANCH_MANAGER: "BRANCH_MANAGER";
        HQ_MANAGER: "HQ_MANAGER";
        ADMIN: "ADMIN";
    }>>;
    branchId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=authValidation.d.ts.map