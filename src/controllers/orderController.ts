import {
  Request,
  Response
} from "express";

import prisma
from "../config/prisma.js";

export const getChefOrders = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const chef =
      await prisma.user.findUnique({

        where: {

          id:
            (req as any) .user.id
        }
      });

    if (!chef?.branchId) {

      res.status(400).json({

        message:
          "Chef is not assigned to a branch"
      });

      return;
    }

    const orders =
      await prisma.order.findMany({

        where: {

          reservation: {

            branchId:
              chef.branchId
          },

          status: {

            in: [

              "PENDING",

              "CONFIRMED",

              "PREPARING",

              "READY"
            ]
          }
        },

        include: {

          customer: true,

          reservation: {

            include: {

              branch: true
            }
          },

          orderItems: {

            include: {

              menuItem: true
            }
          }
        },

        orderBy: {

          createdAt:
            "desc"
        }
      });

    res.status(200).json(
      orders
    );

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message:
        "Server error"
    });
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const {
      status
    } = req.body;

    const allowedStatuses = [
      "CONFIRMED",
      "PREPARING",
      "READY",
      "COMPLETED"
    ];

    if (
      !allowedStatuses.includes(
        String(status)
      )
    ) {

      res.status(400).json({

        message:
          "Invalid order status"
      });

      return;
    }

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

    const existingOrder =
      await prisma.order.findUnique({

        where: {

          id:
            String(req.params.id)
        },

        include: {

          reservation: true
        }
      });

    if (!existingOrder) {

      res.status(404).json({

        message:
          "Order not found"
      });

      return;
    }

    if (
      existingOrder.reservation.branchId !==
      chef.branchId
    ) {

      res.status(403).json({

        message:
          "You can only update orders for your branch"
      });

      return;
    }

    if (
      existingOrder.status ===
      "COMPLETED"
    ) {

      res.status(400).json({

        message:
          "Order already completed"
      });

      return;
    }

    const updatedOrder =
      await prisma.order.update({

        where: {

          id:
            String(req.params.id)
        },

        data: {

          status
        }
      });

    await prisma.reservation.update({

      where: {

        id:
          existingOrder.reservationId
      },

      data: {

        status:
          status as any
      }
    });

    if (
      status === "COMPLETED"
    ) {

      await prisma.branch.update({

        where: {

          id:
            existingOrder.reservation.branchId
        },

        data: {

          revenue: {

            increment:
              existingOrder.totalPrice
          }
        }
      });
    }

    res.status(200).json({

      message:
        "Order updated successfully",

      order:
        updatedOrder
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message:
        "Server error"
    });
  }
};
