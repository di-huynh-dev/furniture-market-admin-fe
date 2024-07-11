import commonApi from '@/api/commonApi'
import useAuthStore, { useAuthStoreSelectors } from '@/store/auth-store'

const useRefreshToken = () => {
  const selectRefreshToken = useAuthStore((state) => state.selectRefreshToken)

  const addAuth = useAuthStoreSelectors.use.addAuth()

  const removeAuth = useAuthStoreSelectors.use.removeAuth()
  const refresh = async () => {
    try {
      const resp = await commonApi.refreshToken(selectRefreshToken())
      if (resp.status === 200) {
        addAuth(resp.data.data)
        return resp.data.data.accessToken
      } else {
        removeAuth()
        await commonApi.logout()
      }
    } catch (error) {
      removeAuth()
    }
  }
  return refresh
}

export default useRefreshToken
