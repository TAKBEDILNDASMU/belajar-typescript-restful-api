import supertest from "supertest"
import { UserTest, ContactTest, AddressTest } from "./test-util"
import { web } from "../src/app/web"
import { logger } from "../src/app/logger"

describe("POST /api/contacts/{contactId}/addresses", () => {
  beforeEach(async () => {
    await UserTest.createOne()
    await ContactTest.createOne()
  })

  afterEach(async () => {
    await AddressTest.deleteAll()
    await ContactTest.deleteAll()
    await UserTest.delete()
  })

  it("should be able to create address", async () => {
    const contact = await ContactTest.findOne()
    const result = await supertest(web)
      .post(`/api/contacts/${contact.id}/addresses`)
      .send({
        street: "test",
        city: "test",
        province: "test",
        country: "test",
        postal_code: "test",
      })
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    logger.debug(result.body)
    expect(result.status).toBe(201)
    expect(result.body.data.street).toBe("test")
    expect(result.body.data.city).toBe("test")
    expect(result.body.data.province).toBe("test")
    expect(result.body.data.country).toBe("test")
    expect(result.body.data.postal_code).toBe("test")
  })

  it("should reject if the request is invalid", async () => {
    const contact = await ContactTest.findOne()
    const result = await supertest(web)
      .post(`/api/contacts/${contact.id}/addresses`)
      .send({
        street: "",
        city: "",
        province: "",
        country: "",
        postal_code: "",
      })
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    expect(result.status).toBe(400)
    expect(result.body.message).toBeDefined()
  })

  it("should reject if the contact is not found", async () => {
    const contact = await ContactTest.findOne()
    const result = await supertest(web)
      .post(`/api/contacts/${contact.id + 1}/addresses`)
      .send({
        street: "test",
        city: "test",
        province: "test",
        country: "test",
        postal_code: "test",
      })
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    logger.debug(result.body)
    expect(result.status).toBe(404)
    expect(result.body.errors).toBeDefined()
  })
})

describe("GET /api/contacts/{contactId}/addresses", () => {
  beforeEach(async () => {
    await UserTest.createOne()
    await ContactTest.createOne()
    await AddressTest.createOne()
    await AddressTest.createOne()
    await AddressTest.createOne()
  })

  afterEach(async () => {
    await AddressTest.deleteAll()
    await ContactTest.deleteAll()
    await UserTest.delete()
  })

  it("should be able to get list of addresses", async () => {
    const contact = await ContactTest.findOne()
    const results = await supertest(web)
      .get(`/api/contacts/${contact.id}/addresses`)
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    expect(results.status).toBe(200)
    expect(results.body.data).toHaveLength(3)
  })

  it("should reject if the contact is not found", async () => {
    const contact = await ContactTest.findOne()
    const results = await supertest(web)
      .get(`/api/contacts/${contact.id + 1}/addresses`)
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    console.info(results.body)
    expect(results.status).toBe(404)
    expect(results.body.errors).toBeDefined()
  })
})

describe("GET /api/contacts/{contactId}/addresses/{addressId}", () => {
  beforeEach(async () => {
    await UserTest.createOne()
    await ContactTest.createOne()
    await AddressTest.createOne()
  })

  afterEach(async () => {
    await AddressTest.deleteAll()
    await ContactTest.deleteAll()
    await UserTest.delete()
  })

  it("should be able to get an address", async () => {
    const contact = await ContactTest.findOne()
    const address = await AddressTest.findOne()
    const result = await supertest(web)
      .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    console.info(result.body)
    expect(result.status).toBe(200)
    expect(result.body.data.street).toBe("test")
    expect(result.body.data.city).toBe("test")
    expect(result.body.data.province).toBe("test")
    expect(result.body.data.country).toBe("test")
    expect(result.body.data.postal_code).toBe("test")
  })

  it("should reject if the address is not found", async () => {
    const contact = await ContactTest.findOne()
    const address = await AddressTest.findOne()
    const result = await supertest(web)
      .get(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    expect(result.status).toBe(404)
    expect(result.body.errors).toBe("Address is not found")
  })

  it("should reject if contact is not found", async () => {
    const contact = await ContactTest.findOne()
    const address = await AddressTest.findOne()
    const result = await supertest(web)
      .get(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    expect(result.status).toBe(404)
    expect(result.body.errors).toBe("Contact is not Found!")
  })

  it("should reject if the contact query is not a number", async () => {
    const address = await AddressTest.findOne()
    const result = await supertest(web)
      .get(`/api/contacts/akuadalahstring/addresses/${address.id}`)
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    console.info(result.body)
    expect(result.status).toBe(400)
    expect(result.body.message).toBeDefined()
  })

  it("should reject if the address query is not a number", async () => {
    const contact = await ContactTest.findOne()
    const result = await supertest(web)
      .get(`/api/contacts/${contact.id}/addresses/akuadalahstring`)
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    expect(result.status).toBe(400)
    expect(result.body.message).toBeDefined()
  })
})

describe("PUT /api/contacts/{contactId}/addresses/{addressId}", () => {
  beforeEach(async () => {
    await UserTest.createOne()
    await ContactTest.createOne()
    await AddressTest.createOne()
  })

  afterEach(async () => {
    await AddressTest.deleteAll()
    await ContactTest.deleteAll()
    await UserTest.delete()
  })

  it("should be able to update an address", async () => {
    const contact = await ContactTest.findOne()
    const address = await AddressTest.findOne()
    const result = await supertest(web)
      .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .send({
        street: "newTest",
        city: "newTest",
        province: "newTest",
        country: "newTest",
        postal_code: "newTest",
      })
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    console.info(result.body)
    expect(result.status).toBe(200)
    expect(result.body.data.street).toBe("newTest")
    expect(result.body.data.city).toBe("newTest")
    expect(result.body.data.province).toBe("newTest")
    expect(result.body.data.country).toBe("newTest")
    expect(result.body.data.postal_code).toBe("newTest")
  })

  it("should reject if the address is not found", async () => {
    const contact = await ContactTest.findOne()
    const address = await AddressTest.findOne()
    const result = await supertest(web)
      .put(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
      .send({
        street: "newTest",
        city: "newTest",
        province: "newTest",
        country: "newTest",
        postal_code: "newTest",
      })
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    expect(result.status).toBe(404)
    expect(result.body.errors).toBe("Address is not found")
  })

  it("should reject if contact is not found", async () => {
    const contact = await ContactTest.findOne()
    const address = await AddressTest.findOne()
    const result = await supertest(web)
      .put(`/api/contacts/${contact.id + 1}/addresses/${address.id + 1}`)
      .send({
        street: "newTest",
        city: "newTest",
        province: "newTest",
        country: "newTest",
        postal_code: "newTest",
      })
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    expect(result.status).toBe(404)
    expect(result.body.errors).toBe("Contact is not Found!")
  })

  it("should reject if the contact query is not a number", async () => {
    const address = await AddressTest.findOne()
    const result = await supertest(web)
      .put(`/api/contacts/akuadalahstring/addresses/${address.id}`)
      .send({
        street: "newTest",
        city: "newTest",
        province: "newTest",
        country: "newTest",
        postal_code: "newTest",
      })
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    console.info(result.body)
    expect(result.status).toBe(400)
    expect(result.body.message).toBeDefined()
  })

  it("should reject if the address query is not a number", async () => {
    const contact = await ContactTest.findOne()
    const result = await supertest(web)
      .put(`/api/contacts/${contact.id}/addresses/akuadalahstring`)
      .send({
        street: "newTest",
        city: "newTest",
        province: "newTest",
        country: "newTest",
        postal_code: "newTest",
      })
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")
    expect(result.status).toBe(400)
    expect(result.body.message).toBeDefined()
  })
})

describe("DELETE /api/contacts/{contactId}/addresses/{addressId}", () => {
  beforeEach(async () => {
    await UserTest.createOne()
    await ContactTest.createOne()
    await AddressTest.createOne()
  })

  afterEach(async () => {
    await AddressTest.deleteAll()
    await ContactTest.deleteAll()
    await UserTest.delete()
  })

  it("should be able to delete contact", async () => {
    const contact = await ContactTest.findOne()
    const address = await AddressTest.findOne()
    const result = await supertest(web)
      .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    expect(result.status).toBe(200)
    expect(result.body.data).toBe("OK")
  })

  it("should reject if the address is not found", async () => {
    const contact = await ContactTest.findOne()
    const address = await AddressTest.findOne()
    const result = await supertest(web)
      .delete(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    expect(result.status).toBe(404)
    expect(result.body.errors).toBe("Address is not found")
  })

  it("should reject if contact is not found", async () => {
    const contact = await ContactTest.findOne()
    const address = await AddressTest.findOne()
    const result = await supertest(web)
      .delete(`/api/contacts/${contact.id + 1}/addresses/${address.id + 1}`)
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    expect(result.status).toBe(404)
    expect(result.body.errors).toBe("Contact is not Found!")
  })

  it("should reject if the contact query is not a number", async () => {
    const address = await AddressTest.findOne()
    const result = await supertest(web)
      .delete(`/api/contacts/akuadalahstring/addresses/${address.id}`)
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    console.info(result.body)
    expect(result.status).toBe(400)
    expect(result.body.message).toBeDefined()
  })

  it("should reject if the address query is not a number", async () => {
    const contact = await ContactTest.findOne()
    const result = await supertest(web)
      .delete(`/api/contacts/${contact.id}/addresses/akuadalahstring`)
      .set("X-API-TOKEN", "550e8400-e29b-41d4-a716-446655440000")

    expect(result.status).toBe(400)
    expect(result.body.message).toBeDefined()
  })
})
