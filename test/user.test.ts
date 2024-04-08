import supertest from "supertest"
import { web } from "../src/app/web"
import { UserTest } from "./test-util"
import { logger } from "../src/app/logger"
import bcrypt from "bcrypt"

describe("POST /api/users", () => {
  afterEach(async () => {
    await UserTest.delete()
  })

  it("should reject register new user if the request invalid", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "",
      password: "",
      name: "",
    })

    expect(result.statusCode).toBe(400)
    expect(result.error).toBeDefined()
  })

  it("should register new user", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "test",
      password: "test",
      name: "test",
    })

    expect(result.statusCode).toBe(201)
    expect(result.body.data.username).toBe("test")
  })
})

describe("POST /api/users/login", () => {
  beforeEach(async () => {
    await UserTest.createOne()
  })

  afterEach(async () => {
    await UserTest.delete()
  })

  it("should reject if the request invalid", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "",
      password: "",
    })

    expect(result.status).toBe(400)
    expect(result.error).toBeDefined()
  })

  it("should be able to login", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "test",
      password: "test",
    })

    logger.debug(result.body)
    expect(result.status).toBe(200)
    expect(result.body.data.username).toBe("test")
  })

  it("should reject if the username is incorrect", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "test1",
      password: "test",
    })

    expect(result.status).toBe(401)
    expect(result.body.errors).toBeDefined()
  })

  it("should reject if the password is wrong", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "test",
      password: "test1",
    })

    expect(result.status).toBe(401)
    expect(result.body.errors).toBeDefined()
  })
})

describe("GET /api/users/current", () => {
  beforeEach(async () => {
    await UserTest.createOne()
  })

  afterEach(async () => {
    await UserTest.delete()
  })

  it("should be able to get user", async () => {
    const result = await supertest(web)
      .get("/api/users/current")
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    logger.debug(result.body)
    expect(result.status).toBe(200)
    expect(result.body.data.username).toBe("test")
    expect(result.body.data.name).toBe("test")
  })

  it("should reject if token is invalid", async () => {
    const result = await supertest(web).get("/api/users/current").set("X-API-TOKEN", "idontknow")

    logger.debug(result.body)
    expect(result.status).toBe(401)
    expect(result.body.errors).toBeDefined()
  })
})

describe("PATCH /api/users/current", () => {
  beforeEach(async () => {
    await UserTest.createOne()
  })

  afterEach(async () => {
    await UserTest.delete()
  })

  it("should be able to update user", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .send({
        name: "newTest",
        password: "newPassword",
      })
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    logger.debug(result.body)
    expect(result.status).toBe(200)
    expect(result.body.data.name).toBe("newTest")
    expect(result.body.data.username).toBe("test")
  })

  it("should reject if token is invalid", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .send({
        name: "newTest",
        password: "newPassword",
      })
      .set("X-API-TOKEN", "idontknow")

    expect(result.status).toBe(401)
    expect(result.body.errors).toBe("Unauthorized")
  })

  it("should reject if the request is invalid", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .send({
        name: "",
        password: "",
      })
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    expect(result.status).toBe(400)
    expect(result.body.message).toBeDefined()
  })

  it("should be able to update only the name", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .send({
        name: "newTest",
      })
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    expect(result.status).toBe(200)
    expect(result.body.data.name).toBe("newTest")
  })

  it("should be able to update only the password", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .send({
        password: "newPassword",
      })
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    const user = await UserTest.get()

    expect(result.status).toBe(200)
    expect(await bcrypt.compare("newPassword", user.password)).toBe(true)
  })
})

describe("DELETE /api/users/current", () => {
  beforeEach(async () => {
    await UserTest.createOne()
  })

  afterEach(async () => {
    await UserTest.delete()
  })

  it("should be able to logout", async () => {
    const result = await supertest(web)
      .delete("/api/users/current")
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    expect(result.status).toBe(200)
    expect(result.body.data).toBe("OK")
  })

  it("should reject if token is invalid", async () => {
    const result = await supertest(web).delete("/api/users/current").set("X-API-TOKEN", "idontknow")

    expect(result.status).toBe(401)
    expect(result.body.errors).toBe("Unauthorized")
  })
})
