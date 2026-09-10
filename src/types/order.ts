import type { PrintLocation } from './custom-design';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
export type PaymentMethod = 'COD' | 'BANK_TRANSFER' | 'ONLINE';

export interface OrderItem {
  id: string;
  productName: string;
  productSlug?: string | null;
  variantSku?: string | null;
  colorName?: string | null;
  sizeLabel?: string | null;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  isCustomDesign: boolean;
  customDesignSnapshot?: {
    garmentName?: string;
    color?: string;
    size?: string;
    printLocations?: PrintLocation[];
    assets?: Array<{
      printLocation: PrintLocation;
      imageUrl: string;
      positionX: number;
      positionY: number;
      scale: number;
      rotation: number;
    }>;
    notes?: string;
    previewImageUrl?: string;
  } | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  taxAmount: number;
  total: number;
  currency: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingAddressSnapshot: Record<string, unknown>;
  billingAddressSnapshot?: Record<string, unknown> | null;
  notes?: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}