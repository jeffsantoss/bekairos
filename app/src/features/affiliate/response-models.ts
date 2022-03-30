export interface AffiliateResponse {
  name: string
  address: any
  reviewAvg: number
  distance: string
  category: CategoryResponse
}

export interface CategoryResponse {
  id: string
  name: string
}
