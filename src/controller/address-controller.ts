import { NextFunction, Response } from "express"
import { UserRequest } from "../type/user-request"
import { CreateAddressRequest, GetAddressRequest, UpdateAddressRequest } from "../model/address-model"
import { AddressServices } from "../service/address-service"

export class AddressController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: CreateAddressRequest = req.body as CreateAddressRequest
      request.contact_id = Number(req.params.contactId)

      const response = await AddressServices.create(request, req.user!)
      res.status(201).json({
        data: response,
      })
    } catch (e) {
      next(e)
    }
  }

  static async list(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const contactId = Number(req.params.contactId)
      const response = await AddressServices.list(contactId, req.user!)

      res.status(200).json({
        data: response,
      })
    } catch (e) {
      next(e)
    }
  }

  static async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: GetAddressRequest = {
        contactId: Number(req.params.contactId),
        addressId: Number(req.params.addressId),
      }
      const response = await AddressServices.get(request, req.user!)

      res.status(200).json({
        data: response,
      })
    } catch (e) {
      next(e)
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: UpdateAddressRequest = req.body as UpdateAddressRequest
      request.id = Number(req.params.addressId)
      request.contact_id = Number(req.params.contactId)

      const response = await AddressServices.update(request, req.user!)
      res.status(200).json({
        data: response,
      })
    } catch (e) {
      next(e)
    }
  }

  static async delete(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: GetAddressRequest = {
        contactId: Number(req.params.contactId),
        addressId: Number(req.params.addressId),
      }

      const response = await AddressServices.delete(request, req.user!)
      res.status(200).json({
        data: "OK",
      })
    } catch (e) {
      next(e)
    }
  }
}
