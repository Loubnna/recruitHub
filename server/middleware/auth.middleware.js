import jwt from "jsonwebtoken";
import prisma from "../config/database.js";

export const authenticate = async (req, res, next) => {
    try {
        //  Get JWT from HTTP-only cookie
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        // Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        //  Find the user
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

        //  Token is valid but user doesn't exist
        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        //  Attach authenticated user to request
        req.user = user;

        //  Continue to the next middleware/controller
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
    
};