import { ZodError } from "zod";

const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);

            next();
        } catch (err) {
            if (err instanceof ZodError) {
                return res.status(400).json({
                    message: "Validation failed",
                    errors: err.issues.map((e) => ({
                        path: e.path.join("."),
                        message: e.message
                    }))
                });
            }

            next(err);
        }
    };
};

export default validate;