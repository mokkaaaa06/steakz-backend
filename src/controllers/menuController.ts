import { Request, Response }
from "express";

import prisma
from "../config/prisma.js";

export const createMenuItem = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const {
      name,
      description,
      price,
      image,
      category
    } = req.body;

    const item =
      await prisma.menuItem.create({

        data: {

          name,
          description,

          price:
            Number(price),

          image,
          category
        }
      });

    res.status(201).json(item);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Server error"
    });
  }
};

export const getMenuItems = async (
  _req: Request,
  res: Response
): Promise<void> => {

  try {

    const items =
      await prisma.menuItem.findMany({

        orderBy: {
          createdAt:
            "desc"
        }
      });

    res.status(200).json(items);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Server error"
    });
  }
};

export const updateMenuItem = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const id =
      req.params.id as string;

    const {
      name,
      description,
      price,
      image,
      category,
      available
    } = req.body;

    const item =
      await prisma.menuItem.update({

        where: {
          id
        },

        data: {

          name,
          description,

          price:
            Number(price),

          image,
          category,
          available
        }
      });

    res.status(200).json(item);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Server error"
    });
  }
};

export const deleteMenuItem = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const id =
      req.params.id as string;

    await prisma.menuItem.delete({

      where: {
        id
      }
    });

    res.status(200).json({
      message:
        "Menu item deleted"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Server error"
    });
  }
};