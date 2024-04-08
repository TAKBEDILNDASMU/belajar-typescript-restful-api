import { Address, Contact, User } from "@prisma/client"
import { prismaClient } from "../src/app/db"
import bcrypt from "bcrypt"
import { logger } from "../src/app/logger"

export class UserTest {
  static async delete() {
    await prismaClient.user.deleteMany({
      where: {
        username: "test",
      },
    })
  }

  static async createOne() {
    await prismaClient.user.create({
      data: {
        username: "test",
        name: "test",
        password: await bcrypt.hash("test", 10),
        token: "550e8400-e29b-41d4-a716-446655440000",
      },
    })
  }

  static async get(): Promise<User> {
    const user = await prismaClient.user.findUnique({
      where: {
        username: "test",
      },
    })

    if (!user) {
      throw new Error("User not Found")
    }

    return user
  }
}

export class ContactTest {
  static async deleteAll() {
    await prismaClient.contact.deleteMany({
      where: {
        username: "test",
      },
    })
  }

  static async createOne() {
    await prismaClient.contact.create({
      data: {
        first_name: "test",
        last_name: "test",
        email: "test@test.com",
        phone: "test",
        username: "test",
      },
    })
  }

  static async findOne(): Promise<Contact> {
    const contact = await prismaClient.contact.findFirst({
      where: {
        username: "test",
      },
    })

    if (!contact) {
      throw new Error("Contact is not found")
    }

    return contact
  }
}

export class AddressTest {
  static async deleteAll() {
    await prismaClient.address.deleteMany({
      where: {
        contact: {
          username: "test",
        },
      },
    })
  }

  static async createOne() {
    const contact = await ContactTest.findOne()
    await prismaClient.address.create({
      data: {
        contact_id: contact.id,
        street: "test",
        city: "test",
        province: "test",
        country: "test",
        postal_code: "test",
      },
    })
  }

  static async findOne(): Promise<Address> {
    const address = await prismaClient.address.findFirst({
      where: {
        street: "test",
      },
    })

    if (!address) {
      throw new Error("Address not found")
    }

    return address
  }
}
