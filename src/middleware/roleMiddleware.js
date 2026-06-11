export const authorize = (...roles) => {
    return (req, res, next) => {
        try {
            const user = req.user;
            if (!user) {
                res.status(401).json({
                    message: "User not authenticated"
                });
                return;
            }
            const userRole = String(user.role);
            if (roles.length > 0 &&
                !roles.includes(userRole)) {
                res.status(403).json({
                    message: "Access denied"
                });
                return;
            }
            next();
        }
        catch (error) {
            console.log("ROLE MIDDLEWARE ERROR:", error);
            res.status(500).json({
                message: "Authorization error"
            });
        }
    };
};
//# sourceMappingURL=roleMiddleware.js.map