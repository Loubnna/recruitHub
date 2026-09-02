import prisma from "../../config/database.js";

const companySelect = {
    id: true,
    name: true,
    description: true,
    location: true,
    website: true,
    createdAt: true,
    recruiters: true,
    jobOffers: true
};

export const createCompany = async ({ name, description, location, website, authorId }) => {
    const newCompany = await prisma.company.create({
        data: {
            name,
            description,
            location,
            website
        },
        select: companySelect
    });

    // Link the creating recruiter to this company (Company has no
    // "authorId" field of its own — ownership is modeled through
    // User.companyId, so the recruiter who creates a company becomes
    // one of its recruiters).
    await prisma.user.update({
        where: { id: authorId },
        data: { companyId: newCompany.id }
    });

    return newCompany;
};

export const getAllCompanies = async () => {
    return await prisma.company.findMany({
        select: companySelect
    });
};

export const getCompanyById = async (id) => {
    return await prisma.company.findUnique({
        where: { id },
        select: companySelect
    });
};

export const updateCompany = async (id, data, user) => {
    const company = await prisma.company.findUnique({
        where: { id }
    });

    if (!company) {
        const error = new Error("company not found");
        error.statusCode = 404;
        throw error;
    }

    // Admin can update any company
    // Recruiter can only update the company they belong to
    if (user.role !== "ADMIN" && user.companyId !== id) {
        const error = new Error("you are not allowed to perform this action");
        error.statusCode = 403;
        throw error;
    }

    return await prisma.company.update({
        where: { id },
        data,
        select: companySelect
    });
};

export const deleteCompany = async (id, user) => {
    const company = await prisma.company.findUnique({
        where: { id }
    });

    if (!company) {
        const error = new Error("company not found");
        error.statusCode = 404;
        throw error;
    }

    // Admin can delete any company
    // Recruiter can only delete the company they belong to
    if (user.role !== "ADMIN" && user.companyId !== id) {
        const error = new Error("you are not allowed to perform this action");
        error.statusCode = 403;
        throw error;
    }

    return await prisma.company.delete({
        where: { id }
    });
};