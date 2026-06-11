import { z } from "zod";

export const createReservationSchema =
  z.object({

    branchId: z
      .string()
      .min(1, "Branch ID is required"),

    guests: z
      .number()
      .min(1, "Minimum 1 guest")
      .max(12, "Maximum 12 guests"),

    reservationTime: z
      .string()
      .refine(
        (date) => {

          const reservationDate =
            new Date(date);

          return reservationDate >
            new Date();
        },

        {
          message:
            "Reservation time must be in the future"
        }
      ),

    notes: z
      .string()
      .max(300, "Notes too long")
      .optional()
  });

export const updateReservationStatusSchema = z.object({

  status: z.enum([

    "CONFIRMED",

    "PREPARING",

    "READY",

    "COMPLETED"
  ])
});
