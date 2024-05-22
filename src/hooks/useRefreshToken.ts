import commonApi from '@/api/commonApi'
import { useAuthStoreSelectors } from '@/store/auth-store'

const useRefreshToken = () => {
  const addAuth = useAuthStoreSelectors.use.addAuth()

  const removeAuth = useAuthStoreSelectors.use.removeAuth()
  const refresh = async () => {
    try {
      const resp = await commonApi.refreshToken()
      if (resp.status === 200) {
        addAuth(resp.data.data)
        return resp.data.data.accessToken
      } else {
        removeAuth()
        await commonApi.logout()
      }
    } catch (error) {
      removeAuth()
      await commonApi.logout()
    }
  }
  return refresh
}

export default useRefreshToken
