import * as companyService from "./company.service.js";
import { createCompanySchema, updateCompanySchema } from "./company.validation.js";

export const create = async (req, res) => {
    try {
        const parsed = createCompanySchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                errors: parsed.error.flatten()
            });
        }

        const company = await companyService.createCompany({
            ...parsed.data,
            authorId: req.user.id
        });

        return res.status(201).json({
            message: "company created successfully",
            company
        });

    } catch (error) {
        console.error(error);
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : "failed to create the company"
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const companies = await companyService.getAllCompanies();
        return res.status(200).json(companies);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "failed to fetch companies"
        });
    }
};

export const getById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid company ID"
            });
        }

        const company = await companyService.getCompanyById(id);

        if (!company) {
            return res.status(404).json({ message: "company not found" });
        }

        return res.status(200).json({ company });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "failed to fetch company" });
    }
};

export const update = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid company ID"
            });
        }

        const parsed = updateCompanySchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                errors: parsed.error.flatten()
            });
        }

        const updatedCompany = await companyService.updateCompany(id, parsed.data, req.user);

        return res.status(200).json({
            message: "company updated successfully",
            company: updatedCompany
        });

    } catch (error) {
        console.error(error);
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : "failed to update the company"
        });
    }
};

export const remove = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid company ID"
            });
        }

        await companyService.deleteCompany(id, req.user);

        return res.status(200).json({
            message: "company deleted successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : "failed to delete the company"
        });
    }
};