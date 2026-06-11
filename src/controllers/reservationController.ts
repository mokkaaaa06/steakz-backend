import { Request, Response } from "express";

import prisma from "../config/prisma.js";

import {
  createReservationSchema,
  updateReservationStatusSchema
} from "../validations/reservationValidation.js";

export const createReservation = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const {
      branchId,
      guests,
      reservationTime,
      notes,
      items
    } = req.body;

    const user =
      (req as any).user;

    if (!user) {

      res.status(401).json({
        message:
          "User not authenticated"
      });

      return;
    }

    if (
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {

      res.status(400).json({

        message:
          "Please select at least one menu item"
      });

      return;
    }

    const branch =
      await prisma.branch.findUnique({

        where: {
          id: String(branchId)
        }
      });

    if (!branch) {

      res.status(404).json({

        message:
          "Branch not found"
      });

      return;
    }

    const reservationDate =
      new Date(
        reservationTime
      );

    const reservationHour =
      reservationDate.getHours();

    if (

      reservationHour <
        branch.openingHour ||

      reservationHour >=
        branch.closingHour

    ) {

      res.status(400).json({

        message:
          "Branch is closed at selected reservation time"
      });

      return;
    }

    const slotStart =
      new Date(
        reservationDate
      );

    slotStart.setMinutes(
      0,
      0,
      0
    );

    const slotEnd =
      new Date(
        slotStart
      );

    slotEnd.setHours(
      slotEnd.getHours() + 1
    );

    const reservationsAtSameTime =
      await prisma.reservation.findMany({

        where: {

          branchId:
            String(branchId),

          reservationTime: {

            gte:
              slotStart,

            lt:
              slotEnd
          },

          status: {

            not:
              "CANCELLED"
          }
        }
      });

    const totalGuests =
      reservationsAtSameTime.reduce(

        (
          sum,
          reservation
        ) =>
          sum + reservation.guests,

        0
      );

    if (

      totalGuests + guests >
      branch.capacity

    ) {

      res.status(400).json({

        message:
          "Branch capacity exceeded for this time slot"
      });

      return;
    }

    const existingReservation =
      await prisma.reservation.findFirst({

        where: {

          customerId:
            String(user.id),

          branchId:
            String(branchId),

          reservationTime:
            reservationDate,

          status: {

            not:
              "CANCELLED"
          }
        }
      });

    if (existingReservation) {

      res.status(400).json({

        message:
          "Duplicate reservation detected"
      });

      return;
    }

    let totalPrice = 0;

    const orderItemsData = [];

    for (const item of items) {

      const menuItem =
        await prisma.menuItem.findUnique({

          where: {
            id: item.menuItemId
          }
        });

      if (!menuItem) {

        res.status(404).json({

          message:
            "Menu item not found"
        });

        return;
      }

      const subtotal =
        menuItem.price *
        item.quantity;

      totalPrice += subtotal;

      orderItemsData.push({

        menuItemId:
          menuItem.id,

        quantity:
          item.quantity,

        subtotal
      });
    }

    const reservation =
      await prisma.reservation.create({

        data: {

          customerId:
            String(user.id),

          branchId:
            String(branchId),

          guests:
            Number(guests),

          reservationTime:
            reservationDate,

          notes:
            notes || null
        }
      });

    const order =
      await prisma.order.create({

        data: {

          reservationId:
            reservation.id,

          customerId:
            String(user.id),

          totalPrice,

          status:
            "PENDING"
        }
      });

    await prisma.orderItem.createMany({

      data:
        orderItemsData.map(
          (item) => ({

            orderId:
              order.id,

            menuItemId:
              item.menuItemId,

            quantity:
              item.quantity,

            subtotal:
              item.subtotal
          })
        )
    });

    const fullReservation =
      await prisma.reservation.findUnique({

        where: {

          id:
            reservation.id
        },

        include: {

          branch: true,

          customer: true,

          order: {

            include: {

              orderItems: {

                include: {

                  menuItem: true
                }
              }
            }
          }
        }
      });

    res.status(201).json({

      message:
        "Reservation and pre-order created successfully",

      reservation:
        fullReservation
    });

  } catch (error: any) {

    console.log(error);

    res.status(500).json({

      message:
        "Server error"
    });
  }
};

export const getMyReservations = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const user =
      (req as any).user;

    const reservations =
      await prisma.reservation.findMany({

        where: {

          customerId:
            String(user.id)
        },


        include: {

          branch: true,

          order: {

            include: {

              orderItems: {

                include: {

                  menuItem: true
                }
              }
            }
          }
        },

        orderBy: {

          createdAt:
            "desc"
        }
      });

    res.status(200).json(
      reservations
    );

  } catch (error: any) {

    console.log(error);

    res.status(500).json({

      message:
        "Server error"
    });
  }
};

export const getBranchReservations = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const user =
      (req as any).user;

    const branchId =
      String(req.params.branchId);

    if (
      user.role === "BRANCH_MANAGER" &&
      String(user.branchId) !== branchId
    ) {
      res.status(403).json({
        message:
          "Branch managers can only access their own branch reservations"
      });
      return;
    }

    const reservations =
      await prisma.reservation.findMany({

        where: {

          branchId:
            branchId
        },

        include: {

          customer: true,

          branch: true,

          order: {

            include: {

              orderItems: {

                include: {

                  menuItem: true
                }
              }
            }
          }
        },

        orderBy: {

          createdAt:
            "desc"
        }
      });

    res.status(200).json(
      reservations
    );

  } catch (error: any) {

    console.log(error);

    res.status(500).json({

      message:
        "Server error"
    });
  }
};

export const getAllReservations = async (
  _req: Request,
  res: Response
): Promise<void> => {

  try {
    const reservations =
      await prisma.reservation.findMany({
        include: {
          customer: true,
          branch: true,
          order: {
            include: {
              orderItems: {
                include: {
                  menuItem: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      });

    res.status(200).json(reservations);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

export const updateReservationStatus = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const validatedData =
      updateReservationStatusSchema.parse(
        req.body
      );

    const {
      status
    } = validatedData;

    const chef =
      await prisma.user.findUnique({

        where: {

          id:
            (req as any).user.id
        }
      });

    if (!chef?.branchId) {

      res.status(400).json({

        message:
          "Chef is not assigned to a branch"
      });

      return;
    }

    const reservation =
      await prisma.reservation.findUnique({

        where: {

          id:
            String(req.params.id)
        },

        include: {

          branch: true,

          order: true
        }
      });

    if (!reservation) {

      res.status(404).json({

        message:
          "Reservation not found"
      });

      return;
    }

    if (
      reservation.branchId !==
      chef.branchId
    ) {

      res.status(403).json({

        message:
          "You can only update reservations for your branch"
      });

      return;
    }

    if (

      reservation.status ===
      "COMPLETED"

    ) {

      res.status(400).json({

        message:
          "Completed reservations cannot be modified"
      });

      return;
    }

    const updatedReservation =
      await prisma.reservation.update({

        where: {

          id:
            String(req.params.id)
        },

        data: {

          status:
            status as any
        },

        include: {

          branch: true,

          customer: true,

          order: {

            include: {

              orderItems: {

                include: {

                  menuItem: true
                }
              }
            }
          }
        }
      });

    await prisma.order.updateMany({

  where: {

    reservationId:
      reservation.id
  },

  data: {

    status:
      status as any
  }
});
    res.status(200).json({

      message:
        "Reservation status updated successfully",

      reservation:
        updatedReservation
    });

  } catch (error: any) {

    console.log(error);

    if (
      error.name === "ZodError"
    ) {

      res.status(400).json({

        message:
          "Validation failed",

        errors:
          error.issues.map(
            (issue: any) =>
              issue.message
          )
      });

      return;
    }

    res.status(500).json({

      message:
        "Server error"
    });
  }
};

export const cancelReservation = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const user =
      (req as any).user;

    const reservation =
      await prisma.reservation.findUnique({

        where: {

          id:
            String(req.params.id)
        },

        include: {

          order: true
        }
      });

    if (!reservation) {

      res.status(404).json({

        message:
          "Reservation not found"
      });

      return;
    }

    if (

      String(
        reservation.customerId
      ) !==
      String(user.id)

    ) {

      res.status(403).json({

        message:
          "You can only cancel your own reservations"
      });

      return;
    }

    if (

      reservation.status ===
      "COMPLETED"

    ) {

      res.status(400).json({

        message:
          "Completed reservations cannot be cancelled"
      });

      return;
    }

    if (

      reservation.status ===
      "CANCELLED"

    ) {

      res.status(400).json({

        message:
          "Reservation already cancelled"
      });

      return;
    }

    const updatedReservation =
      await prisma.reservation.update({

        where: {

          id:
            String(req.params.id)
        },

        data: {

          status:
            "CANCELLED"
        }
      });

    if (
      reservation.order
    ) {

      await prisma.order.update({

        where: {

          id:
            reservation.order.id
        },

        data: {

          status:
            "CANCELLED"
        }
      });
    }

    res.status(200).json({

      message:
        "Reservation cancelled successfully",

      reservation:
        updatedReservation
    });

  } catch (error: any) {

    console.log(error);

    res.status(500).json({

      message:
        "Server error"
    });
  }
};

export const updateReservation = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const id =
      req.params.id as string;

    const {
      status
    } = req.body;

    const reservation =
      await prisma.reservation.update({

        where: {
          id
        },

        data: {
          status
        }
      });

    res.status(200).json(
      reservation
    );

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Server error"
    });
  }
};
