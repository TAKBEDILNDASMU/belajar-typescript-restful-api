import supertest from "supertest"
import { ContactTest, UserTest } from "./test-util"
import { web } from "../src/app/web"
import { logger } from "../src/app/logger"

describe("POST /api/contacts", () => {
  beforeEach(async () => {
    await UserTest.createOne()
  })

  afterEach(async () => {
    await ContactTest.deleteAll()
    await UserTest.delete()
  })

  it("should be able to create contact", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .send({
        first_name: "test",
        last_name: "test",
        email: "test@test.com",
        phone: "test",
      })
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    logger.debug(result.body)

    expect(result.status).toBe(201)
    expect(result.body.data.id).toBeDefined()
    expect(result.body.data.first_name).toBe("test")
    expect(result.body.data.last_name).toBe("test")
    expect(result.body.data.email).toBe("test@test.com")
    expect(result.body.data.phone).toBe("test")
  })

  it("should reject if request is invalid", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .send({
        first_name: "test",
        phone: "111111111111111111111111111111111111111111111111111111111111111",
      })
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    expect(result.status).toBe(400)
    expect(result.body.message).toBeDefined()
  })

  it("should be able to create only with username field", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .send({
        first_name: "test",
      })
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    expect(result.status).toBe(201)
    expect(result.body.data.first_name).toBe("test")
  })

  it("should reject if the token is invalid", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .send({
        first_name: "test",
      })
      .set("X-API-TOKEN", "idontknow")

    expect(result.status).toBe(401)
    expect(result.body.errors).toBe("Unauthorized")
  })
})

describe("GET /api/contacts/{contactId}", () => {
  beforeEach(async () => {
    await UserTest.createOne()
    await ContactTest.createOne()
  })

  afterEach(async () => {
    await ContactTest.deleteAll()
    await UserTest.delete()
  })

  it("should be able to get contact", async () => {
    const contact = await ContactTest.findOne()
    const result = await supertest(web)
      .get(`/api/contacts/${contact.id}`)
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    expect(result.status).toBe(200)
    expect(result.body.data.first_name).toBe("test")
    expect(result.body.data.last_name).toBe("test")
    expect(result.body.data.email).toBe("test@test.com")
    expect(result.body.data.phone).toBe("test")
  })

  it("should reject if the id is invalid", async () => {
    const contact = await ContactTest.findOne()
    const result = await supertest(web)
      .get(`/api/contacts/${contact.id + 1}`)
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    expect(result.status).toBe(404)
    expect(result.body.errors).toBe("Contact is not Found!")
  })

  it("should reject if the query is not a number", async () => {
    const result = await supertest(web)
      .get(`/api/contacts/watashiwastring`)
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    expect(result.status).toBe(400)
    expect(result.body.message).toBeDefined()
  })
})

describe("PUT /api/contacts/{contactId}", () => {
  beforeEach(async () => {
    await UserTest.createOne()
    await ContactTest.createOne()
  })

  afterEach(async () => {
    await ContactTest.deleteAll()
    await UserTest.delete()
  })

  it("should be able to update contact", async () => {
    const contact = await ContactTest.findOne()
    const result = await supertest(web)
      .put(`/api/contacts/${contact.id}`)
      .send({
        first_name: "newTest",
        last_name: "newTest",
        email: "newTest@gmail.com",
        phone: "newTest",
      })
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    logger.debug(result.body)
    expect(result.status).toBe(200)
    expect(result.body.data.id).toBe(contact.id)
    expect(result.body.data.first_name).toBe("newTest")
    expect(result.body.data.last_name).toBe("newTest")
    expect(result.body.data.email).toBe("newTest@gmail.com")
    expect(result.body.data.phone).toBe("newTest")
  })

  it("should reject if request is invalid", async () => {
    const contact = await ContactTest.findOne()
    const result = await supertest(web)
      .put(`/api/contacts/${contact.id}`)
      .send({
        first_name: "",
        last_name: "",
        email: "test",
        phone: "",
      })
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    expect(result.status).toBe(400)
    expect(result.body.message).toBeDefined()
  })

  it("should reject if contact is not found", async () => {
    const contact = await ContactTest.findOne()
    const result = await supertest(web)
      .put(`/api/contacts/${contact.id + 1}`)
      .send({
        first_name: "newTest",
        last_name: "newTest",
        email: "newTest@gmail.com",
        phone: "newTest",
      })
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    expect(result.status).toBe(404)
    expect(result.body.errors).toBeDefined()
  })
})

describe("DELETE /api/contacts/{contactId}", () => {
  beforeEach(async () => {
    await UserTest.createOne()
    await ContactTest.createOne()
  })

  afterEach(async () => {
    await ContactTest.deleteAll()
    await UserTest.delete()
  })

  it("should be able to delete contact", async () => {
    const contact = await ContactTest.findOne()
    const result = await supertest(web)
      .delete(`/api/contacts/${contact.id}`)
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    expect(result.status).toBe(200)
    expect(result.body.data).toBe("OK")
  })

  it("should reject if contact id is invalid", async () => {
    const contact = await ContactTest.findOne()
    const result = await supertest(web)
      .delete(`/api/contacts/${contact.id + 1}`)
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    expect(result.status).toBe(404)
    expect(result.body.errors).toBeDefined()
  })
})

describe("SEARCH /api/contacts", () => {
  beforeEach(async () => {
    await UserTest.createOne()
    await ContactTest.createOne()
  })

  afterEach(async () => {
    await ContactTest.deleteAll()
    await UserTest.delete()
  })

  it("should be able to search contact", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    expect(result.status).toBe(200)
    logger.debug(result.body)
    expect(result.body.data).toHaveLength(1)
    expect(result.body.paging.total_page).toBe(1)
    expect(result.body.paging.size).toBe(10)
    expect(result.body.paging.current_page).toBe(1)
  })

  it("should be able to search with name query", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .query({
        name: "est",
      })
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    logger.debug(result.body)
    expect(result.status).toBe(200)
    expect(result.body.data).toHaveLength(1)
  })

  it("should be able to search with email query", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .query({
        email: ".com",
      })
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    logger.debug(result.body)
    expect(result.status).toBe(200)
    expect(result.body.data).toHaveLength(1)
  })
  it("should be able to search with phone query", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .query({
        phone: "test",
      })
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    logger.debug(result.body)
    expect(result.status).toBe(200)
    expect(result.body.data).toHaveLength(1)
  })

  it("should be able to search with paging", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .query({
        page: 2,
        size: 25,
      })
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    logger.debug(result.body)
    expect(result.status).toBe(200)
    expect(result.body.data).toHaveLength(0)
    expect(result.body.paging.total_page).toBe(1)
    expect(result.body.paging.current_page).toBe(2)
    expect(result.body.paging.size).toBe(25)
  })
})
