import prisma from "../../config/database.js";
import AppError from "../../utils/appError.js";

export const createResume = async ({
    userId,
    fileName,
    fileKey,
    fileSize,
    mimeType
}) => {
    const newResume = await prisma.resume.create({
        data: {
            userId,
            fileName,
            fileKey,
            fileSize,
            mimeType
        },
        select: {
            id: true,
            userId: true,
            fileName: true,
            fileKey: true,
            fileSize: true,
            mimeType: true,
            createdAt: true
        }
    });

    return newResume;
};
export const updateResume = async ({
    id,
    fileName,
    fileKey,
    fileSize,
    mimeType
}) => {

    const resume = await prisma.resume.findUnique({
        where: { id }
    });

    if (!resume) {
        throw new AppError("Resume not found", 404);
    }

    const updatedResume = await prisma.resume.update({
        where: { id },
        data: {
            fileName,
            fileKey,
            fileSize,
            mimeType
        }
    });

    return updatedResume;
};