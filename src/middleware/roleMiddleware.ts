import {
  Request,
  Response,
  NextFunction
} from "express";

export const authorize = (
  ...roles: string[]
) => {

  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    try {

      const user =
        (req as any).user;

      if (!user) {

        res.status(401).json({

          message:
            "User not authenticated"
        });

        return;
      }

      const userRole =
        String(user.role);

      if (

        roles.length > 0 &&

        !roles.includes(
          userRole
        )

      ) {

        res.status(403).json({

          message:
            "Access denied"
        });

        return;
      }

      next();

    } catch (error) {

      console.log(
        "ROLE MIDDLEWARE ERROR:",
        error
      );

      res.status(500).json({

        message:
          "Authorization error"
      });
    }
  };
};