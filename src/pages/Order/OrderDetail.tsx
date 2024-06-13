import LoadingComponent from '@/components/Loading/LoadingComponent'
import { query_keys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { ResponseItem } from '@/types/order.type'
import { formatPrice } from '@/utils/helpers'
import { useQuery } from '@tanstack/react-query'
import { Card, Tag, Timeline } from 'antd'
import { useParams } from 'react-router-dom'

const OrderDetail = () => {
  const { id } = useParams()
  const axiosPrivate = useAxiosPrivate()

  const { data, isLoading } = useQuery({
    queryKey: [query_keys.ORDER_DETAIL, id],
    queryFn: async () => {
      const resp = await axiosPrivate.get(`/admin/order/${id}`)
      return resp.data.data
    },
    enabled: !!id,
  })
  if (isLoading) return <LoadingComponent />

  return (
    <Card title={<p>Chi tiết về đơn hàng {data.id}</p>}>
      <table className="table-auto">
        <thead>
          <tr>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Thông tin giao hàng</td>
            <td></td>
            <td></td>
            <td>
              <div className="font-bold">
                <p>
                  {data.deliveryAddress.receiverName} - {data.deliveryAddress.receiverPhone}
                </p>
                <p>{data.deliveryAddress.deliveryAddress}</p>
              </div>
            </td>
          </tr>

          <tr>
            <td>Thông tin cửa hàng</td>
            <td></td>
            <td></td>
            <td>
              <div className="flex gap-2 my-2 items-center">
                <img src={data.storeInfo.logo} alt="" className="w-20" />
                <p>{data.storeInfo.name}</p>
              </div>
            </td>
          </tr>
          <tr>
            <td>Chi tiết trạng thái</td>
            <td></td>
            <td></td>
            <td>
              <div>
                <Timeline
                  items={[
                    {
                      children: (
                        <>
                          <Tag color="magenta">Chờ vận chuyển</Tag> {data.statusWithDates[1].date}
                        </>
                      ),
                    },
                    {
                      children: (
                        <>
                          <Tag color="magenta">Đang vận chuyển</Tag> {data.statusWithDates[2].date}
                        </>
                      ),
                    },
                    {
                      children: (
                        <>
                          <Tag color="magenta">Đã giao</Tag> {data.statusWithDates[3].date}
                        </>
                      ),
                    },
                    {
                      children: (
                        <>
                          <Tag color="magenta">Đã hủy</Tag> {data.statusWithDates[4].date}
                        </>
                      ),
                    },
                    {
                      children: (
                        <>
                          <Tag color="magenta">Hoàn tiền</Tag> {data.statusWithDates[6].date}
                        </>
                      ),
                    },
                    {
                      children: (
                        <>
                          <Tag color="magenta">Giao hàng không thành công</Tag> {data.statusWithDates[5].date}
                        </>
                      ),
                    },
                  ]}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td>Thông tin sản phẩm</td>
            <td></td>
            <td></td>
            <td>
              {data.orderItemList.map((item: ResponseItem) => (
                <div className=" border-b">
                  <img src={item.productThumbnail} className="h-20 w-20" alt={item.productId} />
                  <p>Mã sản phẩm: {item.productId}</p>
                  <p>Tên sản phẩm: {item.productName}</p>
                  <p>
                    {item.quantity} x {formatPrice(item.total)}
                  </p>
                </div>
              ))}
            </td>
          </tr>
          <tr>
            <td>Trạng thái thanh toán</td>
            <td></td>
            <td></td>
            <td>{data.paid ? <Tag color="green">Đã thanh toán</Tag> : <Tag color="red">Chưa thanh toán</Tag>}</td>
          </tr>
          <tr>
            <td>Phí vận chuyển</td>
            <td></td>
            <td></td>
            <td>
              <div className="font-bold">
                <p>{formatPrice(data.shippingFee)}</p>
              </div>
            </td>
          </tr>
          <tr>
            <td>Giảm giá</td>
            <td></td>
            <td></td>
            <td>
              <div className="font-bold">
                <p>{formatPrice(data.voucherDiscount)}</p>
              </div>
            </td>
          </tr>
          <tr>
            <td>Tổng đơn</td>
            <td></td>
            <td></td>
            <td>
              <div className="font-bold">
                <p>{formatPrice(data.total)}</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </Card>
  )
}

export default OrderDetail
