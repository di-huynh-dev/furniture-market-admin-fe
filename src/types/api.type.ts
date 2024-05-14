import { UserType } from './user.type'

export type ApiResponse<Data> = {
  status: number | string
  data: Data
  messages: [string]
}

export type RegisterData = {
  status: number | string
  messages: [string]
}

export type LoginData = {
  accessToken: string
  user: UserType
  refreshToken: string
}
