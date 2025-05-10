import { OptionalId, Package } from 'type/entity'

export type PackagePostBody = {
    record: OptionalId<Package>
}

export type PackagePostParams = PackagePostBody & {}

export type PackagePostResponse =
    | {
          meta: PackagePostParams
          data: Package[]
      }
    | {
          error: string
          details?: any
      }
