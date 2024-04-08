import { Address } from "@prisma/client"

export type AddressResponse = {
  id: number
  street: string
  city?: string | null
  province?: string | null
  country: string
  postal_code: string
}

export type CreateAddressRequest = {
  street: string
  city?: string
  province?: string
  country: string
  postal_code: string
  contact_id: number
}

export type GetAddressRequest = {
  contactId: number
  addressId: number
}

export type UpdateAddressRequest = {
  id: number
  street: string
  city?: string
  province?: string
  country: string
  postal_code: string
  contact_id: number
}

export function toAddressResponse(address: Address): AddressResponse {
  return {
    id: address.id,
    street: address.street,
    city: address.city,
    province: address.province,
    country: address.country,
    postal_code: address.postal_code,
  }
}
