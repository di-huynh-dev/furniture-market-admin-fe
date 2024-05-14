export type UserType = {
  id: string
  fullName: string
  email: string
  phone: string
  avatar: string
  birthday: string
  status: boolean
  gender: string
  role: string
  emailConfirmed: boolean
}

export type LoginData = {
  accessToken: string
  user: UserType
  refreshToken: string
}

export type RegisterType = {
  email: string
  phone: string
  birthday: string
  password: string
  confirmPassword: string
  fullName: string
  gender: string
}
export type RegisterSellerType = {
  shopName: string
  ownerName: string
  birthday: string
  gender: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  address?: string
  deliveryMethod?: string
  checked: boolean
}

export type RegisterSellerApiType = {
  shopName: string
  ownerName: string
  birthday: string
  gender: string
  email: string
  phone: string
  password: string
}

export type RegisterApiType = {
  email: string
  phone: string
  birthday: string
  password: string
  fullName: string
  gender: string
}

export type OtpApiType = {
  email: string
  type: string
}

export type OtpConfirmType = {
  email: string
  otpCode: string
}

export type LoginApiType = {
  email: string
  password: string
}
