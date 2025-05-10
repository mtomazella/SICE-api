import { User } from "type/entity"

export type LoginBody = {
    username: string
    password: string
}

export type LoginParams = LoginBody & {}

export type LoginResponse =
    | {
        token: string
        user: User
      }
    | {
          error: string
          details?: any
      }
