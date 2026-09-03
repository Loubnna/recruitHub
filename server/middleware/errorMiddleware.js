import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";

import AppError from "../utils/appError.js";
export const errorHandler = (err, req, res, next) => {

  // 1. Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: "fail",
      message: "Validation failed",
      errors: err.issues
    });
  }

  // 2. Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {

    // Unique constraint
    if (err.code === "P2002") {
      return res.status(409).json({
        status: "fail",
        message: "Resource already exists"
      });
    }

    // Record not found
    if (err.code === "P2025") {
      return res.status(404).json({
        status: "fail",
        message: "Resource not found"
      });
    }

    // Foreign key violation
    if (err.code === "P2003") {
      return res.status(400).json({
        status: "fail",
        message: "Invalid related resource"
      });
    }

    // Required relation violation
    if (err.code === "P2014") {
      return res.status(400).json({
        status: "fail",
        message: "Invalid relation"
      });
    }
  }

  // 3. JWT errors
  if (err instanceof jwt.TokenExpiredError) {
    return res.status(401).json({
      status: "fail",
      message: "Token has expired"
    });
  }

  if (err instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid token"
    });
  }

  // 4. Our own application errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  // 5. Unexpected errors
  console.error(err);

  return res.status(500).json({
    status: "error",
    message: "Internal server error"
  });
};