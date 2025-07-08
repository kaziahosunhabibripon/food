// src/types.ts
export interface SubCategory {
  id: number;
  name: string;
  description?: string;
  category_id: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  sub_categories: SubCategory[];
}

export interface FoodItem {
  id: number;
  purchase_group_id: number;
  purchase_category_id: number;
  purchase_sub_category_id: number;
  unit_id: number;
  full_name: string;
  name: string;
  description: string;
  price: number;
  cost_price: number;
  code: string;
  barcode: string;
  brand_id: number | null;
  stock: number;
  size_id: number;
  color_id: number | null;
  image: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  quantity?: number;
  category: Category;
  sub_category: SubCategory;
  arabic_name?: string;
  purchase_item_id: string;
  final_price: number;
  offer_price: number;
}
export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  delivery_address: string;
  status: string;
  order_items: OrderItem[];
  total_amount: number;
  created_at: string;
  latitude?: number; // Optional, can be null
  longitude?: number; // Optional, can be null
  // or Date if it’s already parsed
};
export type AppButtonProps = {
  title?: string;
  subtitle?: string;
  customClasses?: string;
  link?: string;
  showIcon?: boolean;
  btnIcon?: React.ElementType;
};
export interface IFood {
  id: number;
  purchase_group_id: number;
  purchase_category_id: number;
  purchase_sub_category_id?: number;
  unit_id: number;
  full_name?: string;
  name: string;
  arabic_name: string;
  description?: string;
  cost_price: number;
  price: number;
  offer_price: string;
  start_date?: string;
  end_date?: string;
  code: string;
  barcode: string;
  brand_id?: number;
  qty_in: number;
  qty_out: number;
  qty_current: number;
  stock: number;
  size_id?: number;
  color_id?: string;
  image: string;
  created_at: string;
  updated_at: string;
  image_url: string;
  final_price: number;
}

export type IProduct = {
  id: number;
  name: string;
  arabic_name?: string;
  price: number;
  final_price?: number;
  offer_price?: string;
  image_url: string;
  currency?: string;
};
