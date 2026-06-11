import {
  Request,
  Response
} from "express";

import prisma
from "../config/prisma.js";

export const getAnalytics = async (
  _req: Request,
  res: Response
): Promise<void> => {

  try {

    const totalCustomers =
      await prisma.user.count({

        where: {
          role: "CUSTOMER"
        }
      });

    const totalChefs =
      await prisma.user.count({

        where: {
          role: "CHEF"
        }
      });

    const totalBranches =
      await prisma.branch.count();

    const totalReservations =
      await prisma.reservation.count();

    const pendingReservations =
      await prisma.reservation.count({

        where: {
          status: "PENDING"
        }
      });

    const confirmedReservations =
      await prisma.reservation.count({

        where: {
          status: "CONFIRMED"
        }
      });

    const preparingReservations =
      await prisma.reservation.count({

        where: {
          status: "PREPARING"
        }
      });

    const readyReservations =
      await prisma.reservation.count({

        where: {
          status: "READY"
        }
      });

    const completedReservations =
      await prisma.reservation.count({

        where: {
          status: "COMPLETED"
        }
      });

    const cancelledReservations =
      await prisma.reservation.count({

        where: {
          status: "CANCELLED"
        }
      });

    const completedOrders =
      await prisma.order.findMany({

        where: {
          status: "COMPLETED"
        }
      });

    const totalRevenue =
      completedOrders.reduce(

        (sum, order) =>

          sum + order.totalPrice,

        0
      );

    res.status(200).json({

      totalCustomers,

      totalChefs,

      totalBranches,

      totalReservations,

      pendingReservations,

      confirmedReservations,

      preparingReservations,

      readyReservations,

      completedReservations,

      cancelledReservations,

      totalRevenue
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message:
        "Server error"
    });
  }
};

export const getBranchAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const branchId =
      req.params.branchId as string;

    const totalReservations =
      await prisma.reservation.count({

        where: {
          branchId
        }
      });

    const pendingReservations =
      await prisma.reservation.count({

        where: {

          branchId,

          status:
            "PENDING"
        }
      });

    const confirmedReservations =
      await prisma.reservation.count({

        where: {

          branchId,

          status:
            "CONFIRMED"
        }
      });

    const preparingReservations =
      await prisma.reservation.count({

        where: {

          branchId,

          status:
            "PREPARING"
        }
      });

    const readyReservations =
      await prisma.reservation.count({

        where: {

          branchId,

          status:
            "READY"
        }
      });

    const completedReservations =
      await prisma.reservation.count({

        where: {

          branchId,

          status:
            "COMPLETED"
        }
      });

    const cancelledReservations =
      await prisma.reservation.count({

        where: {

          branchId,

          status:
            "CANCELLED"
        }
      });

    const totalCustomers =
      await prisma.user.count({
        where: {
          role: "CUSTOMER",
          reservations: {
            some: {
              branchId
            }
          }
        }
      });

    const totalChefs =
      await prisma.user.count({
        where: {
          role: "CHEF",
          branchId
        }
      });

    const branchOrders =
      await prisma.order.findMany({

        where: {

          status:
            "COMPLETED",

          reservation: {

            branchId
          }
        }
      });

    const totalRevenue =
      branchOrders.reduce(

        (sum, order) =>

          sum + order.totalPrice,

        0
      );

    res.status(200).json({

      totalCustomers,

      totalChefs,

      totalBranches: 1,

      totalReservations,

      pendingReservations,

      confirmedReservations,

      preparingReservations,

      readyReservations,

      completedReservations,

      cancelledReservations,

      totalRevenue
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message:
        "Server error"
    });
  }
};