import { z } from "zod";

export const registerSchema = z.object({

  name:
    z.string().min(2),

  email:
    z.string().email(),

  password:
    z.string().min(6),

  role:
    z.enum([
      "CUSTOMER",
      "CHEF",
      "BRANCH_MANAGER",
      "HQ_MANAGER",
      "ADMIN"
    ]),

  branchId:
    z.preprocess((value) => {
      if (typeof value === "string") {
        const trimmed = value.trim();
        return trimmed === "" ? undefined : trimmed;
      }
      return value;
    }, z.string().min(1).optional())
}).superRefine((data, ctx) => {
  if ((data.role === "CHEF" || data.role === "BRANCH_MANAGER") && !data.branchId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "branchId is required for CHEF and BRANCH_MANAGER"
    });
  }
});

export const loginSchema = z.object({

  email:
    z.string().email(),

  password:
    z.string().min(6)
});

export const updateUserSchema = z.object({

  name:
    z.string().min(2).optional(),

  email:
    z.string().email().optional(),

  password:
    z.string().min(6).optional(),

  role:
    z.enum([
      "CUSTOMER",
      "CHEF",
      "BRANCH_MANAGER",
      "HQ_MANAGER",
      "ADMIN"
    ]).optional(),

  branchId:
    z.preprocess((value) => {
      if (typeof value === "string") {
        const trimmed = value.trim();
        return trimmed === "" ? undefined : trimmed;
      }
      return value;
    }, z.string().min(1).optional())
}).superRefine((data, ctx) => {
  if ((data.role === "CHEF" || data.role === "BRANCH_MANAGER") && !data.branchId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "branchId is required for CHEF and BRANCH_MANAGER when role is set"
    });
  }
});