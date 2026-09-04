import request from "supertest";
import app from "../app.js";
import prisma from "../config/database.js";

describe("Auth API", () => {

    const email = `test-${Date.now()}@example.com`;

    describe("POST /api/v1/auth/register", () => {

        test("should register a new user", async () => {

            const response = await request(app)
                .post("/api/v1/auth/register")
                .send({
                    name: "Test User",
                    email,
                    password: "password123"
                });
            console.log("STATUS:", response.statusCode);
            console.log("BODY:", response.body);

            expect(response.statusCode).toBe(201);

            expect(response.body.user).toBeDefined();

            expect(response.body.user).toMatchObject({
                name: "Test User",
                email,
                role: "CANDIDATE"
            });

            expect(response.headers["set-cookie"]).toBeDefined();

            expect(response.headers["set-cookie"][0])
                .toContain("token=");
        });
    });

    afterAll(async () => {
        await prisma.user.deleteMany({
            where: {
                email
            }
        });
    });
});