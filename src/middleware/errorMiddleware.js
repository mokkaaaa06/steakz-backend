export const errorHandler = (error, _req, res, _next) => {
    console.log(error);
    if (error.name === "ZodError") {
        res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: error.issues.map((issue) => issue.message)
        });
        return;
    }
    if (error.code === "P2002") {
        res.status(400).json({
            success: false,
            message: "Duplicate field value"
        });
        return;
    }
    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
};
//# sourceMappingURL=errorMiddleware.js.map