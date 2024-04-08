import { ZodType, z } from "zod"

export class ContactValidation {
  static readonly CREATE: ZodType = z.object({
    first_name: z.string().min(3).max(100),
    last_name: z.string().min(3).max(100).optional(),
    email: z.string().min(3).max(100).optional(),
    phone: z.string().min(3).max(20).optional(),
  })

  static readonly UPDATE: ZodType = z.object({
    id: z.number().positive(),
    first_name: z.string().min(3).max(100),
    last_name: z.string().min(3).max(100).optional(),
    email: z.string().min(3).max(100).optional(),
    phone: z.string().min(3).max(20).optional(),
  })

  static readonly SEARCH: ZodType = z.object({
    name: z.string().min(3).max(100).optional(),
    phone: z.string().min(3).max(100).optional(),
    email: z.string().min(3).max(100).optional(),
    page: z.number().min(1).positive(),
    size: z.number().min(1).max(100).positive(),
  })

  static readonly GET: ZodType = z.number().min(1).positive()
}