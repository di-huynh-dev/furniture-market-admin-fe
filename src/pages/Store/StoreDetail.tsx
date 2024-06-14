import LoadingComponent from '@/components/Loading/LoadingComponent'
import { query_keys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useQuery } from '@tanstack/react-query'
import { Card } from 'antd'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const StoreDetail = () => {
  const { id } = useParams()
  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    document.title = 'Chi tiết cửa hàng'
  }, [])

  const { data, isLoading } = useQuery({
    queryKey: [query_keys.SHOP_DETAIL, id],
    queryFn: async () => {
      const resp = await axiosPrivate.get(`/admin/store/${id}`)
      return resp.data.data
    },
    enabled: !!id,
  })

  if (isLoading) return <LoadingComponent />

  return (
    <Card title={<p>Chi tiết về cửa hàng {data.shopName}</p>}>
      <table className="table-auto">
        <thead>
          <tr>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Thông tin chủ sở hữu</td>
            <td></td>
            <td></td>
            <td>
              <div className="font-bold">
                <p>{data.ownerName}</p>
              </div>
            </td>
          </tr>

          <tr>
            <td>Thông tin chủ cửa hàng</td>
            <td></td>
            <td></td>
            <td>
              <div className="flex gap-2 my-2 items-center">
                <img src={data.logo} alt="" className="w-20" />
                <p>{data.shopName}</p>
                <p>{data.address}</p>
              </div>
            </td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <div className="font-bold flex gap-2 my-2">
                <p>Số người theo dõi: {data.numFollower}</p>
                <p>Đang theo dõi: {data.numFollowing}</p>
                <p>Số lượng đánh giá: {data.numReview}</p>
                <p>Điểm đánh giá: {data.avgReviewStar}</p>
              </div>
            </td>
          </tr>
          <tr>
            <td>Mô tả về cửa hàng</td>
            <td></td>
            <td></td>
            <td>
              <p>{data.description}</p>
            </td>
          </tr>
          <tr>
            <td>Top banner</td>
            <td></td>
            <td></td>
            <td>
              <div className="flex gap-2 my-2 items-center">
                <img src={data.topBanner} alt="" className="max-h-30" />
              </div>
            </td>
          </tr>
          <tr>
            <td>Banner thông tin</td>
            <td></td>
            <td></td>
            <td>
              <div className="flex gap-2 my-2 items-center">
                <img src={data.infoBanner} alt="" className="max-h-30" />
              </div>
            </td>
          </tr>
          <tr>
            <td>Thông tin định danh</td>
            <td></td>
            <td></td>
            <td>
              <div className="font-bold grid grid-cols-2 gap-2">
                <img src={data.identifier[2]} alt="Before" />
                <img src={data.identifier[3]} alt="After" />
              </div>
            </td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <div className="font-bold space-y-4">
                <p>
                  Mã số thuế: {data.tax[1]}-{data.tax[0]}
                </p>
                <p>
                  Mã số thẻ định danh: {data.identifier[0]} - {data.identifier[1]}
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </Card>
  )
}

export default StoreDetail
