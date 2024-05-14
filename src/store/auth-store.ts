import { LoginData } from '@/types/user.type'
import { create } from 'zustand'
import { createSelectors } from './create-selectors'
import { devtools } from 'zustand/middleware'

type AuthStoreType = {
  auth: LoginData
  addAuth: (data: LoginData) => void
  removeAuth: () => void
}

const useAuthStore = create<AuthStoreType>()(
  devtools((set) => ({
    auth: {
      accessToken: '',
      user: {
        id: '',
        fullName: '',
        email: '',
        phone: '',
        avatar: '',
        birthday: '',
        status: false,
        gender: '',
        role: '',
        emailConfirmed: false,
      },
      refreshToken: '',
    },
    addAuth: (loginData) => set({ auth: loginData }),
    removeAuth: () =>
      set({
        auth: {
          accessToken: '',
          user: {
            id: '',
            fullName: '',
            email: '',
            phone: '',
            avatar: '',
            birthday: '',
            status: false,
            gender: '',
            role: '',
            emailConfirmed: false,
          },
          refreshToken: '',
        },
      }),
  })),
)

export const useAuthStoreSelectors = createSelectors(useAuthStore)
export default useAuthStore
