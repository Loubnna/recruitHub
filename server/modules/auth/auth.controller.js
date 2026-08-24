import * as authService from "./auth.service.js";

export const register = async (req, res) => {
    try {
        const user = await authService.register(req.body);

        return res.status(201).json({ user });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};