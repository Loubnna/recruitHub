import request from "supertest";
import app from "../app.js";

describe("POST /api/v1/auth/register", () => {

  test("should register a new user", async () => {

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send({
        // registration data
      });

    expect(response.status).toBe(201);
  });

});