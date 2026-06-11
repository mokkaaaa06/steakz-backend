import { Request, Response } from "express";
import prisma from "../config/prisma.js";

export const createBranch = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const {
      name,
      location,
      phone,
      capacity,
      openingHour,
      closingHour
    } = req.body;

    const branch =
      await prisma.branch.create({
        data: {
          name,
          location,

          phone:
            phone || "N/A",

          capacity:
            Number(capacity) || 30,

          openingHour:
            Number(openingHour) || 10,

          closingHour:
            Number(closingHour) || 23
        }
      });

    res.status(201).json(branch);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

export const getBranches = async (
  _req: Request,
  res: Response
): Promise<void> => {

  try {

    const branches =
      await prisma.branch.findMany({

        include: {
          manager: true,
          users: true
        }

      });

    res.status(200).json(branches);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

export const getBranchById = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const id =
      req.params.id as string;

    const branch =
      await prisma.branch.findUnique({

        where: {
          id
        },

        include: {
          manager: true,
          users: true
        }

      });

    if (!branch) {

      res.status(404).json({
        message: "Branch not found"
      });

      return;
    }

    res.status(200).json(branch);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

export const getBranchDashboard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const branchId = req.params.id as string;

    const branch = await prisma.branch.findUnique({
      where: {
        id: branchId
      },
      select: {
        id: true,
        name: true,
        location: true,
        capacity: true,
        openingHour: true,
        closingHour: true,
        manager: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        users: {
          where: {
            role: "CHEF"
          },
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!branch) {
      res.status(404).json({
        message: "Branch not found"
      });
      return;
    }

    const totalReservations = await prisma.reservation.count({
      where: {
        branchId
      }
    });

    const upcomingReservations = await prisma.reservation.count({
      where: {
        branchId,
        status: {
          notIn: ["COMPLETED", "CANCELLED"]
        },
        reservationTime: {
          gte: new Date()
        }
      }
    });

    const completedReservations = await prisma.reservation.count({
      where: {
        branchId,
        status: "COMPLETED"
      }
    });

    const cancelledReservations = await prisma.reservation.count({
      where: {
        branchId,
        status: "CANCELLED"
      }
    });

    const revenueResult = await prisma.order.aggregate({
      _sum: {
        totalPrice: true
      },
      where: {
        status: "COMPLETED",
        reservation: {
          branchId
        }
      }
    });

    const totalRevenue = revenueResult._sum.totalPrice ?? 0;

    res.status(200).json({
      branch: {
        id: branch.id,
        name: branch.name,
        location: branch.location,
        capacity: branch.capacity,
        openingHour: branch.openingHour,
        closingHour: branch.closingHour
      },
      manager: branch.manager,
      chefs: branch.users,
      statistics: {
        totalReservations,
        upcomingReservations,
        completedReservations,
        cancelledReservations,
        totalRevenue
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

export const updateBranch = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const id =
      req.params.id as string;

    const {
      name,
      location,
      phone,
      revenue,
      capacity,
      openingHour,
      closingHour
    } = req.body;

    const branch =
      await prisma.branch.update({

        where: {
          id
        },

        data: {
          name,
          location,
          phone,
          revenue,

          capacity:
            Number(capacity),

          openingHour:
            Number(openingHour),

          closingHour:
            Number(closingHour)
        }

      });

    res.status(200).json(branch);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

export const deleteBranch = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const id =
      req.params.id as string;

    await prisma.user.updateMany({

      where: {
        branchId: id
      },

      data: {
        branchId: null
      }

    });

    await prisma.reservation.deleteMany({

      where: {
        branchId: id
      }

    });

    await prisma.branch.delete({

      where: {
        id
      }

    });

    res.status(200).json({

      message:
        "Branch deleted successfully"

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message:
        "Server error"

    });

  }
};

export const assignManager = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const branchId =
      String(req.params.id);

    const managerId =
      String(req.body.managerId);

    console.log("BRANCH ID:", branchId);
    console.log("MANAGER ID:", managerId);

    const branch =
      await prisma.branch.findUnique({

        where: {
          id: branchId
        }

      });

    if (!branch) {

      res.status(404).json({

        message:
          "Branch not found"

      });

      return;
    }

    const manager =
      await prisma.user.findUnique({

        where: {
          id: managerId
        }

      });

    if (!manager) {

      res.status(404).json({

        message:
          "Manager not found"

      });

      return;
    }

    if (
      manager.role !==
      "BRANCH_MANAGER"
    ) {

      res.status(400).json({

        message:
          "User is not a branch manager"

      });

      return;
    }

    await prisma.branch.update({

      where: {
        id: branchId
      },

      data: {
        managerId: managerId
      }

    });

    await prisma.user.update({

      where: {
        id: managerId
      },

      data: {
        branchId: branchId
      }

    });

    res.status(200).json({

      message:
        "Manager assigned successfully"

    });

  } catch (error) {

    console.log(
      "ASSIGN MANAGER ERROR:",
      error
    );

    res.status(500).json({

      message:
        "Server error"

    });

  }
};