import jwt from "jsonwebtoken";

export const generateToken = (
  id: string,
  role: string,
  branchId?: string | null
) => {
  return jwt.sign(
    { id, role, branchId },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );
};