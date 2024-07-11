import axiosClient, { axiosPrivate } from '@/lib/axios-client'
import { LoginApiType } from '@/types/user.type'
import { ApiResponse, LoginData } from '@/types/api.type'

const commonApi = {
  login(data: LoginApiType) {
    return axiosPrivate.post<ApiResponse<LoginData>>('/auth/login', data, { withCredentials: true })
  },

  getUserProfile() {
    return axiosClient.get('/user')
  },

  refreshToken(token: string) {
    return axiosClient.post(`/auth/refresh?refreshTokenId=${token}`)
  },
  logout() {
    return axiosClient.post('/auth/logout', null, {
      withCredentials: true,
    })
  },
}

export default commonApi
