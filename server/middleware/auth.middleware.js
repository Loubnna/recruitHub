import jwt from "jsonwebtoken";
import prisma from "../config/database.js";

export const authenticate = async (req, res, next) => {
    try {
        // 1. Get JWT from HTTP-only cookie
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        // 2. Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // 3. Find the user
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });

        // 4. Token is valid but user doesn't exist
        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        // 5. Attach authenticated user to request
        req.user = user;

        // 6. Continue to the next middleware/controller
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};