export type ReportedType = {
  id: string
  reason: string
  description: string
  status: string
  createdAt: string
  reporterName: string
  type: string
  explanations: {
    id: string
    description: string
    images: string[]
    reportId: string
    createAt: string
  }[]
  objectInfo: {
    id: string
    name: string
    thumbnail: string
  }
  updatedAt: string
}
