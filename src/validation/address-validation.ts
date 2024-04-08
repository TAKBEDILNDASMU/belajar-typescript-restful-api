import { ZodType, z } from "zod"

export class AddressValidation {
  static readonly CREATE: ZodType = z.object({
    street: z.string().min(3).max(255),
    city: z.string().min(3).max(100).optional(),
    province: z.string().min(3).max(100).optional(),
    country: z.string().min(3).max(100),
    postal_code: z.string().min(3).max(10),
    contact_id: z.number().min(1),
  })

  static readonly GET: ZodType = z.number().min(1).positive()

  static readonly UPDATE: ZodType = z.object({
    id: z.number().min(1).positive(),
    street: z.string().min(3).max(255),
    city: z.string().min(3).max(100).optional(),
    province: z.string().min(3).max(100).optional(),
    country: z.string().min(3).max(100),
    postal_code: z.string().min(3).max(10),
    contact_id: z.number().min(1),
  })
}
