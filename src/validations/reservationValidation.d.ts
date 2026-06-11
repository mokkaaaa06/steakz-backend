import { z } from "zod";
export declare const createReservationSchema: z.ZodObject<{
    branchId: z.ZodString;
    guests: z.ZodNumber;
    reservationTime: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateReservationStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        CONFIRMED: "CONFIRMED";
        PREPARING: "PREPARING";
        READY: "READY";
        COMPLETED: "COMPLETED";
    }>;
}, z.core.$strip>;
//# sourceMappingURL=reservationValidation.d.ts.map