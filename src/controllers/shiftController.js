import prisma from "../config/prisma.js";
export const createShift = async (req, res) => {
    try {
        const { chefId, startTime, endTime } = req.body;
        const shift = await prisma.chefShift.create({
            data: {
                chefId,
                startTime: new Date(startTime),
                endTime: new Date(endTime)
            }
        });
        res.status(201).json(shift);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};
export const getChefShifts = async (req, res) => {
    try {
        const chefId = req.params.chefId;
        const shifts = await prisma.chefShift.findMany({
            where: {
                chefId
            },
            orderBy: {
                startTime: "asc"
            }
        });
        res.status(200).json(shifts);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};
export const getAllShifts = async (req, res) => {
    try {
        const shifts = await prisma.chefShift.findMany({
            include: {
                chef: true
            },
            orderBy: {
                startTime: "asc"
            }
        });
        res.status(200).json(shifts);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};
export const getChefs = async (_req, res) => {
    try {
        const chefs = await prisma.user.findMany({
            where: {
                role: "CHEF"
            },
            select: {
                id: true,
                name: true,
                email: true,
                branchId: true
            }
        });
        res.status(200).json(chefs);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};
//# sourceMappingURL=shiftController.js.map