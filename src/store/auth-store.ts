import { LoginData } from '@/types/user.type'
import { create } from 'zustand'
import { createSelectors } from './create-selectors'
import { devtools, persist } from 'zustand/middleware'

type AuthStoreType = {
  admin_auth: LoginData
  addAuth: (data: LoginData) => void
  removeAuth: () => void
  selectRefreshToken: () => string
}

const useAuthStore = create<AuthStoreType>()(
  devtools(
    persist(
      (set) => ({
        admin_auth: {
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
            active: false,
            emailConfirmed: false,
          },
          refreshToken: '',
        },
        addAuth: (loginData) => set({ admin_auth: loginData }),
        selectRefreshToken: (): string => useAuthStore.getState().admin_auth.refreshToken,
        removeAuth: () =>
          set({
            admin_auth: {
              accessToken: '',
              user: {
                id: '',
                fullName: '',
                email: '',
                phone: '',
                avatar: '',
                birthday: '',
                active: false,
                status: false,
                gender: '',
                role: '',
                emailConfirmed: false,
              },
              refreshToken: '',
            },
          }),
      }),
      { name: 'auth-store' },
    ),
  ),
)

export const useAuthStoreSelectors = createSelectors(useAuthStore)
export default useAuthStore
