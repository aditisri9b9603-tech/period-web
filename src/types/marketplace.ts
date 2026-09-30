export type ProductCategory =
  | 'pads'
  | 'reusable'
  | 'cups'
  | 'tampons'
  | 'underwear'
  | 'liners'
  | 'kits';

export interface PartnerBrand {
  id: string;
  name: string;
  location: string;
  founderStory: string;
  verifiedStatus: 'verified' | 'pending' | 'rejected';
  isLocalIndianStartup: boolean;
  isWomenLed?: boolean;
  badge: string;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  category: ProductCategory;
  categoryName: string;
  shortDescription: string;
  packSize: string;
  mrp: number;
  supplierCost: number;
  shippingCost: number;
  platformMargin: number;
  sakhiPrice: number;
  savings: number;
  tokenPrice: number;
  maxTokenDiscount: number; // e.g. up to 500 tokens gives ₹50 off
  rating: number;
  reviewCount: number;
  image: string;
  features: string[];
  hygieneInstructions: string;
  stock: number;
  isVerifiedSupplier: boolean;
  isSponsored?: boolean;
}

export interface CartItem {
  product: MarketplaceProduct;
  quantity: number;
  paymentPreference: 'money' | 'tokens' | 'combo';
}

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  pincode: string;
  addressLine: string;
  city: string;
  state: string;
}

export interface MarketplaceOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  totalMrp: number;
  totalSakhiPrice: number;
  paidRupees: number;
  paidTokens: number;
  paymentMethod: 'money_gateway' | 'tokens_only' | 'token_combo';
  paymentStatus: 'success' | 'failed' | 'cancelled' | 'pending';
  deliveryStatus: 'dispatched' | 'in_transit' | 'delivered';
  trackingStatusMessage: string;
  shippingAddress: DeliveryAddress;
  isDemoTransaction: boolean;
}

export interface MarketplaceRevenueStats {
  totalOrders: number;
  totalGrossSales: number;
  platformRevenue: number;
  supplierPayouts: number;
  avgOrderValue: number;
  tokenRedemptionsCount: number;
  conversionRatePercent: number;
}
