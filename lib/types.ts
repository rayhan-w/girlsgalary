export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  slug: string;
  image: string;
  size?: string;
  color?: string;
  price: number;
  regularPrice: number;
  quantity: number;
  maxStock: number;
}

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  address: string;
  district: string;
  deliveryZone: 'inside_dhaka' | 'near_dhaka' | 'outside_dhaka';
  paymentMethod: 'COD' | 'BKASH_MANUAL' | 'NAGAD_MANUAL';
  senderPhone?: string;
  transactionId?: string;
  orderNote?: string;
  couponCode?: string;
}
