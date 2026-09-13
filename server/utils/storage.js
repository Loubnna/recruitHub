import fs from "fs";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "resumes");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

export const saveResumeFile = (fileBuffer, originalName) => {
    const uniqueName = `${crypto.randomUUID()}-${originalName}`;
    const filePath = path.join(UPLOAD_DIR, uniqueName);
    fs.writeFileSync(filePath, fileBuffer);
    return uniqueName; // this becomes fileKey
};

export const deleteResumeFile = (fileKey) => {
    const filePath = path.join(UPLOAD_DIR, fileKey);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};