import { Address, Contact, User } from "@prisma/client"
import {
  AddressResponse,
  CreateAddressRequest,
  GetAddressRequest,
  UpdateAddressRequest,
  toAddressResponse,
} from "../model/address-model"
import { Validation } from "../validation/validation"
import { AddressValidation } from "../validation/address-validation"
import { ContactService } from "./contact-service"
import { prismaClient } from "../app/db"
import { ResponseError } from "../error/response-error"

export class AddressServices {
  static async create(request: CreateAddressRequest, user: User): Promise<AddressResponse> {
    const addressRequest = Validation.validate(AddressValidation.CREATE, request)
    await ContactService.checkContactMustExist(user.username, addressRequest.contact_id)

    const result = await prismaClient.address.create({
      data: addressRequest,
    })

    return toAddressResponse(result)
  }

  static async list(contactId: number, user: User): Promise<Array<AddressResponse>> {
    await ContactService.checkContactMustExist(user.username, contactId)

    const results = await prismaClient.address.findMany({
      where: {
        contact: {
          username: "test",
        },
      },
    })

    return results.map((result) => toAddressResponse(result))
  }

  static async checkAddressMustExist(contactId: number, addressId: number): Promise<Address> {
    addressId = Validation.validate(AddressValidation.GET, addressId)
    const address = await prismaClient.address.findFirst({
      where: {
        contact_id: contactId,
        id: addressId,
      },
    })

    if (!address) {
      throw new ResponseError(404, "Address is not found")
    }

    return address
  }

  static async get(request: GetAddressRequest, user: User): Promise<AddressResponse> {
    await ContactService.checkContactMustExist(user.username, request.contactId)
    const address = await this.checkAddressMustExist(request.contactId, request.addressId)

    return toAddressResponse(address)
  }

  static async update(request: UpdateAddressRequest, user: User): Promise<AddressResponse> {
    const addressRequest = Validation.validate(AddressValidation.UPDATE, request)

    await ContactService.checkContactMustExist(user.username, addressRequest.contact_id)
    await this.checkAddressMustExist(addressRequest.contact_id, addressRequest.id)

    const result = await prismaClient.address.update({
      where: {
        id: addressRequest.id,
        contact_id: addressRequest.contact_id,
      },
      data: addressRequest,
    })

    return toAddressResponse(result)
  }

  static async delete(request: GetAddressRequest, user: User): Promise<AddressResponse> {
    await ContactService.checkContactMustExist(user.username, request.contactId)
    await this.checkAddressMustExist(request.contactId, request.addressId)

    const result = await prismaClient.address.delete({
      where: {
        id: request.addressId,
        contact_id: request.contactId,
      },
    })

    return toAddressResponse(result)
  }
}
