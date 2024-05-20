export const formatPrice = (number: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(number)
}

export const formatDate = (inputDate: string): string => {
  const date = new Date(inputDate)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear().toString()
  const formattedDate = `${day}/${month}/${year}`
  return formattedDate
}

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) {
    return true
  }

  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1])) // Giải mã phần payload
    const expirationTime = decodedToken.exp * 1000 // Chuyển đổi giây thành mili-giây

    return Date.now() >= expirationTime // Kiểm tra xem thời gian hiện tại có lớn hơn thời gian hết hạn không
  } catch (error) {
    console.error('Error decoding or parsing token:', error)
    return true // Nếu có lỗi, coi như token đã hết hạn
  }
}
