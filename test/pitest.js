const request = require("supertest");
const app = require("../app");

test("Homepage loads successfully", async () => {
  const response = await request(app).get("/");
  expect(response.statusCode).toBe(200);
});

test("Health check works", async () => {
  const response = await request(app).get("/health");
  expect(response.statusCode).toBe(200);
});
