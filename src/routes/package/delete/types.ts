import { Package } from 'type/entity'

export type PackageDeleteRequest = {
    id: string
}

export type PackageDeleteParams = PackageDeleteRequest & {}

export type PackageDeleteResponse =
    | {
          meta: PackageDeleteParams
          data: Package[]
      }
    | {
          error: string
          details?: any
      }
