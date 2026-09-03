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

export const createCompany = async ({ name, description, location, website }, user) => {
    if (user.role === "RECRUITER") {
        const existingUser = await prisma.user.findUnique({
            where: { id: user.id }
        });

        if (existingUser.companyId !== null) {
            const error = new Error("You already belong to a company");
            error.statusCode = 409;
            throw error;
        }
    }

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
    // User.companyId). Admins can create a company without being
    // tied to it as one of its recruiters.
    if (user.role === "RECRUITER") {
        await prisma.user.update({
            where: { id: user.id },
            data: { companyId: newCompany.id }
        });
    }

    return newCompany;
};

export const getAllCompanies = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const companies =await prisma.company.findMany({
          skip: skip,
          take: limit,
          orderBy: {
           createdAt: "desc"
    }
    });
    const totalCompanies= await prisma.company.count();
    const totalPages =  Math.ceil(totalCompanies / limit);
    return {
    companies,
    pagination: {
      page,
      limit,
      totalCompanies,
      totalPages
    }
  };
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