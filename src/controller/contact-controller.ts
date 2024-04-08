import { NextFunction, Response } from "express"
import { ContactService } from "../service/contact-service"
import { CreateContactRequest, SearchContactRequest, UpdateContactRequest } from "../model/contact-model"
import { UserRequest } from "../type/user-request"
import { logger } from "../app/logger"

export class ContactController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: CreateContactRequest = req.body as CreateContactRequest
      const response = await ContactService.create(request, req.user!)
      res.status(201).json({
        data: response,
      })
    } catch (e) {
      next(e)
    }
  }

  static async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const contactId = Number(req.params.contactId)
      const response = await ContactService.get(contactId, req.user!)
      res.status(200).json({
        data: response,
      })
    } catch (e) {
      next(e)
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const contactId = Number(req.params.contactId)
      const request: UpdateContactRequest = req.body as UpdateContactRequest
      request.id = contactId

      const response = await ContactService.update(request, req.user!)
      res.status(200).json({
        data: response,
      })
    } catch (e) {
      next(e)
    }
  }

  static async delete(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const contactId = Number(req.params.contactId)
      const response = await ContactService.delete(contactId, req.user!)

      res.status(200).json({
        data: "OK",
      })
    } catch (e) {
      next(e)
    }
  }

  static async search(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: SearchContactRequest = {
        name: req.query.name as string,
        phone: req.query.phone as string,
        email: req.query.email as string,
        page: req.query.page ? Number(req.query.page) : 1,
        size: req.query.size ? Number(req.query.size) : 10,
      }

      const response = await ContactService.search(request, req.user!)
      res.status(200).json(response)
    } catch (e) {
      next(e)
    }
  }
}
