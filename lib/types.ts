export interface Category {
  id: string
  name: string
  description: string | null
  icon: string | null
  color: string | null
  slug: string
  created_at: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  category_id: string | null
  image_url: string
  affiliate_link: string | null
  stock?: number
  created_at: string
  updated_at?: string
  category?: Category
}

export interface CartItem {
  product: Product
  quantity: number
}
