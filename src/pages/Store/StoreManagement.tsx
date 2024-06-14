import { useEffect, useState } from 'react'
import { Button, Drawer, Modal, Tag } from 'antd'
import DataTable, { TableColumn } from 'react-data-table-component'
import { AiOutlineEye } from 'react-icons/ai'
import { MdOutlineTableRestaurant } from 'react-icons/md'
import { CiViewList } from 'react-icons/ci'
import { useMutation, useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import LoadingComponent from '@/components/Loading/LoadingComponent'
import { query_keys } from '@/constants/query-keys'
import { ProductDetailType } from '@/types/product.type'
import { StoreType } from '@/types/store.type'
import { OrderItem, ResponseItem } from '@/types/order.type'
import { formatPrice } from '@/utils/helpers'

const StoreManagement = () => {
  const axiosPrivate = useAxiosPrivate()
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState('')
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isPrductListModal, setIsPrductListModal] = useState(false)
  const [isOrderListModal, setIsOrderListModal] = useState(false)
  const [productList, setProductList] = useState<ProductDetailType[]>([])
  const [orderList, setOrderList] = useState<OrderItem[]>([])
  const [currentShop, setCurrentShop] = useState<StoreType | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false)
  const [currentDescription, setCurrentDescription] = useState('')
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false)
  const [currentOrderDetails, setCurrentOrderDetails] = useState<ResponseItem[]>([])

  useEffect(() => {
    document.title = 'Quản lý cửa hàng'
  }, [])

  const { data: storeList, isLoading } = useQuery({
    queryKey: [query_keys.STORE_LIST],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/admin/store')
      return resp.data.data
    },
  })

  const getProductListMutation = useMutation({
    mutationFn: async (id: string) => {
      const resp = await axiosPrivate.get(`/admin/store/${id}/product`)
      return resp
    },
    onSuccess: (resp) => {
      setLoading(false)
      setProductList(resp.data.data)
    },
  })

  const getOrderListMutation = useMutation({
    mutationFn: async (id: string) => {
      const resp = await axiosPrivate.get(`/admin/store/${id}/order`)
      return resp
    },
    onSuccess: (resp) => {
      setLoading(false)
      setOrderList(resp.data.data)
    },
  })

  const showImageModal = (image: string) => {
    setCurrentImage(image)
    setIsImageModalOpen(true)
  }

  const showProductListModal = (id: string) => {
    setLoading(true)
    setIsPrductListModal(true)
    getProductListMutation.mutate(id)
  }

  const showOrderListModal = (id: string) => {
    setLoading(true)
    setIsOrderListModal(true)
    getOrderListMutation.mutate(id)
  }

  const showViewModal = (shop: StoreType) => {
    setCurrentShop(shop)
    setIsViewModalOpen(true)
  }

  const showDescriptionModal = (description: string) => {
    setCurrentDescription(description)
    setIsDescriptionModalOpen(true)
  }

  const showOrderDetailsModal = (products: ResponseItem[]) => {
    setCurrentOrderDetails(products)
    setIsOrderDetailsModalOpen(true)
  }

  const truncateText = (text: string, length: number) => {
    if (text.length <= length) return text
    return text.substring(0, length) + '...'
  }

  const columns: TableColumn<StoreType>[] = [
    {
      name: 'ID',
      cell: (row) => row.id,
    },
    {
      name: 'Người sở hữu',
      selector: (row) => row.ownerName,
    },
    {
      name: 'Tên cửa hàng',
      cell: (row) => (
        <div className="flex gap-2 items-center">
          <img src={row.logo} className="rounded-full w-10 h-10" alt="" />
          <p>{row.shopName}</p>
        </div>
      ),
      sortable: true,
    },
    {
      name: 'Địa chỉ',
      cell: (row) => <p>{row.address}</p>,
    },
    {
      name: 'Thao tác',
      cell: (row) => (
        <div className="text-gray-500 space-y-2 my-2">
          <div>
            <Button icon={<AiOutlineEye />} size="small" onClick={() => showViewModal(row)}>
              Thông tin
            </Button>
          </div>
          <div className="flex gap-2 items-center">
            <Button icon={<MdOutlineTableRestaurant />} size="small" onClick={() => showProductListModal(row.id)}>
              Sản phẩm
            </Button>
            <Button icon={<CiViewList />} size="small" onClick={() => showOrderListModal(row.id)}>
              Đơn hàng
            </Button>
          </div>
        </div>
      ),
    },
  ]

  const productsColunms: TableColumn<ProductDetailType>[] = [
    {
      name: 'Mã sản phẩm ',
      selector: (row) => row.id,
      wrap: true,
    },
    {
      name: 'Hình ảnh',
      cell: (row) => (
        <div className="space-y-2">
          {row.images.map((img) => (
            <img
              src={img}
              alt={row.name}
              className="max-h-14 cursor-pointer"
              key={img}
              onClick={() => showImageModal(img)}
            />
          ))}
        </div>
      ),
    },
    {
      name: 'Tên sản phẩm',
      cell: (row) => row.name,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Vật liệu',
      cell: (row) => row.material,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Thông tin vận chuyển',
      cell: (row) => (
        <div>
          <p>Cao: {row.height}</p>
          <p>Dài: {row.length}</p>
          <p>Rộng: {row.width}</p>
          <p>Trọng lượng: {row.weight}</p>
        </div>
      ),
    },
    {
      name: 'Mô tả',
      cell: (row) => (
        <div>
          <p>{truncateText(row.description, 50)}</p>
          {row.description.length > 50 && (
            <button className="text-blue-500" onClick={() => showDescriptionModal(row.description)}>
              Xem thêm
            </button>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      name: 'Giá nhập',
      cell: (row) => formatPrice(row.price),
      sortable: true,
    },
    {
      name: 'Giá bán',
      cell: (row) => formatPrice(row.salePrice),
      sortable: true,
    },
  ]

  const ordersColumns: TableColumn<OrderItem>[] = [
    { name: 'Mã đơn', cell: (row) => row.id },
    {
      name: 'Danh sách sản phẩm',
      cell: (row) => (
        <div>
          {row.responses.slice(0, 2).map((item: ResponseItem) => (
            <div key={item.productId}>
              <p>ID: {item.productId}</p>
              <img src={item.productThumbnail} alt={item.productName} className="max-h-14" />
              <p>{item.productName}</p>
              <p>
                {item.quantity} x {formatPrice(item.productPrice)}
              </p>
            </div>
          ))}
          {row.responses.length > 1 && (
            <button className="text-blue-500" onClick={() => showOrderDetailsModal(row.responses)}>
              Xem thêm
            </button>
          )}
        </div>
      ),
    },
    {
      name: 'Thanh toán',
      cell: (row) => (row.paid ? <Tag color="green">Đã thanh toán</Tag> : <Tag color="blue">Chưa thanh toán</Tag>),
    },
    {
      name: 'Trạng thái',
      cell: (row) =>
        row.status === 'TO_SHIP' ? (
          <Tag color="orange">Chờ vận chuyển</Tag>
        ) : row.status === 'SHIPPING' ? (
          <Tag color="blue">Đang giao</Tag>
        ) : row.status === 'CANCELLED' ? (
          <Tag color="red">Đã hủy</Tag>
        ) : (
          <Tag color="green">Đã giao</Tag>
        ),
    },
    { name: 'Tổng', selector: (row) => formatPrice(row.total) },
  ]

  return (
    <div>
      <Modal
        title="Hình ảnh sản phẩm"
        open={isImageModalOpen}
        onCancel={() => setIsImageModalOpen(false)}
        footer={null}
      >
        <img src={currentImage} alt="Product" className="w-full object-cover" />
      </Modal>
      <Modal
        width={1300}
        footer={false}
        title={<p>Danh sách tất cả đơn hàng của shop</p>}
        open={isOrderListModal}
        onCancel={() => setIsOrderListModal(false)}
      >
        <DataTable
          columns={ordersColumns}
          data={orderList}
          progressPending={loading}
          progressComponent={<LoadingComponent />}
          subHeader
          pagination
        />
      </Modal>
      <Modal
        width={1300}
        footer={false}
        title={<p>Danh sách tất cả sản phẩm của shop</p>}
        open={isPrductListModal}
        onCancel={() => setIsPrductListModal(false)}
      >
        <DataTable
          columns={productsColunms}
          data={productList}
          progressPending={loading}
          progressComponent={<LoadingComponent />}
          subHeader
          pagination
        />
      </Modal>
      <Drawer loading={isLoading} size="large" onClose={() => setIsViewModalOpen(false)} open={isViewModalOpen}>
        {currentShop && (
          <>
            <div className="flex items-center justify-center">
              <img src={currentShop.logo} alt={currentShop.shopName} className="w-20 my-2 rounded-full" />
            </div>
            <p className="font-bold text-2xl text-center">{currentShop.shopName}</p>
            <div className="grid grid-cols-3 justify-center items-center my-3">
              <p>Người theo dõi: {currentShop.numFollower}</p>
              <p>Đang theo dõi: {currentShop.numFollowing}</p>
              <p>
                Điểm đánh giá: {currentShop.avgReviewStar}/{currentShop.numReview}
              </p>
            </div>
            <p className="font-bold">Thông tin chủ sở hữu</p>
            <div className="grid grid-cols-2">
              <div className="space-y-4">
                <p>Tên chủ sở hữu</p>
                <p>Mã số thuế</p>
                <p>Định danh</p>
                <p>Căn cước</p>
              </div>
              <div className="font-bold space-y-4">
                <p>{currentShop.ownerName}</p>
                <p>
                  {currentShop.tax[1]}-{currentShop.tax[0]}
                </p>
                <p>
                  ID: {currentShop.identifier[0]} - {currentShop.identifier[1]}
                </p>
                <img src={currentShop.identifier[2]} alt="Before" />
                <img src={currentShop.identifier[3]} alt="After" />
              </div>
            </div>
          </>
        )}
      </Drawer>
      <Modal
        title="Mô tả sản phẩm"
        open={isDescriptionModalOpen}
        onCancel={() => setIsDescriptionModalOpen(false)}
        footer={null}
      >
        <p>{currentDescription}</p>
      </Modal>
      <Modal
        width={800}
        title="Chi tiết đơn hàng"
        open={isOrderDetailsModalOpen}
        onCancel={() => setIsOrderDetailsModalOpen(false)}
        footer={null}
      >
        <div>
          {currentOrderDetails.map((item: ResponseItem) => (
            <div key={item.productId} className="mb-4 border-b-2">
              <p>ID: {item.productId}</p>
              <img src={item.productThumbnail} alt={item.productName} className="max-h-14" />
              <p>{item.productName}</p>
              <p>
                {item.quantity} x {formatPrice(item.productPrice)}
              </p>
            </div>
          ))}
        </div>
      </Modal>
      <DataTable
        title={<p className="">Quản lý cửa hàng hệ thống</p>}
        columns={columns}
        data={storeList}
        pagination
        subHeader
        progressComponent={<LoadingComponent />}
        progressPending={isLoading}
        persistTableHead
      />
    </div>
  )
}

export default StoreManagement
