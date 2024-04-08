import { Contact, User } from "@prisma/client"
import { prismaClient } from "../app/db"
import {
  ContactResponse,
  CreateContactRequest,
  SearchContactRequest,
  UpdateContactRequest,
  toContactResponse,
} from "../model/contact-model"
import { ContactValidation } from "../validation/contact-validation"
import { Validation } from "../validation/validation"
import { ResponseError } from "../error/response-error"
import { logger } from "../app/logger"
import { Pageable } from "../model/page"

export class ContactService {
  static async create(request: CreateContactRequest, user: User): Promise<ContactResponse> {
    const createRequest = Validation.validate(ContactValidation.CREATE, request)

    const record = {
      ...createRequest,
      username: user.username,
    }

    const result = await prismaClient.contact.create({
      data: record,
    })

    return toContactResponse(result)
  }

  static async checkContactMustExist(username: string, contactId: number): Promise<Contact> {
    contactId = Validation.validate(ContactValidation.GET, contactId)
    const contact = await prismaClient.contact.findFirst({
      where: {
        id: contactId,
        username: username,
      },
    })

    if (!contact) {
      throw new ResponseError(404, "Contact is not Found!")
    }

    return contact
  }

  static async get(id: number, user: User): Promise<ContactResponse> {
    const contact = await this.checkContactMustExist(user.username, id)

    return toContactResponse(contact)
  }

  static async update(request: UpdateContactRequest, user: User): Promise<ContactResponse> {
    const updateRequest = Validation.validate(ContactValidation.UPDATE, request)
    const contact = await this.checkContactMustExist(user.username, updateRequest.id)

    const result = await prismaClient.contact.update({
      where: {
        id: contact.id,
        username: user.username,
      },
      data: updateRequest,
    })

    return toContactResponse(result)
  }

  static async delete(id: number, user: User): Promise<ContactResponse> {
    await this.checkContactMustExist(user.username, id)

    const result = await prismaClient.contact.delete({
      where: {
        id: id,
      },
    })

    return toContactResponse(result)
  }

  static async search(request: SearchContactRequest, user: User): Promise<Pageable<ContactResponse>> {
    const searchRequest = Validation.validate(ContactValidation.SEARCH, request)
    const filters = []
    const skip = (searchRequest.page - 1) * searchRequest.size

    if (searchRequest.name) {
      filters.push({
        OR: [
          {
            first_name: {
              contains: searchRequest.name,
            },
          },
          {
            last_name: {
              contains: searchRequest.name,
            },
          },
        ],
      })
    }

    if (searchRequest.email) {
      filters.push({
        phone: {
          contains: searchRequest.phone,
        },
      })
    }

    if (searchRequest.phone) {
      filters.push({
        email: {
          contains: searchRequest.email,
        },
      })
    }

    const [contacts, total] = await Promise.all([
      prismaClient.contact.findMany({
        where: {
          username: user.username,
          AND: filters,
        },
        take: searchRequest.size,
        skip: skip,
      }),
      prismaClient.contact.count({
        where: {
          username: user.username,
          AND: filters,
        },
      }),
    ])

    return {
      data: contacts,
      paging: {
        total_page: Math.ceil(total / searchRequest.size),
        current_page: searchRequest.page,
        size: searchRequest.size,
      },
    }
  }
}
