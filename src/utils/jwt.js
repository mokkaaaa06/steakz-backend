import jwt from "jsonwebtoken";
export const generateToken = (id, role, branchId) => {
    return jwt.sign({ id, role, branchId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};
//# sourceMappingURL=jwt.js.map