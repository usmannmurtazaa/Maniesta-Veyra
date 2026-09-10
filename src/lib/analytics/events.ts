declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

export const analyticsEvents = {
  productViewed: (product: { id: string; name: string; price: number }) =>
    trackEvent('view_item', {
      currency: 'PKR',
      value: product.price,
      items: [{ item_id: product.id, item_name: product.name, price: product.price }],
    }),
  searchPerformed: (query: string) => trackEvent('search', { search_term: query }),
  addToCart: (item: { id: string; name: string; price: number; quantity: number }) =>
    trackEvent('add_to_cart', {
      currency: 'PKR',
      value: item.price * item.quantity,
      items: [
        {
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
        },
      ],
    }),
  removeFromCart: (item: { id: string; name: string; price: number; quantity: number }) =>
    trackEvent('remove_from_cart', {
      currency: 'PKR',
      value: item.price * item.quantity,
      items: [
        {
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
        },
      ],
    }),
  wishlistAdded: (product: { id: string; name: string }) =>
    trackEvent('add_to_wishlist', { item_id: product.id, item_name: product.name }),
  checkoutStarted: (cart: {
    subtotal: number;
    items: Array<{ id: string; name: string; unitPrice: number; quantity: number }>;
  }) =>
    trackEvent('begin_checkout', {
      currency: 'PKR',
      value: cart.subtotal,
      items: cart.items.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        price: item.unitPrice,
        quantity: item.quantity,
      })),
    }),
  purchaseCompleted: (order: {
    orderNumber: string;
    total: number;
    items: Array<{
      id: string;
      productName: string;
      unitPrice: number;
      quantity: number;
    }>;
  }) =>
    trackEvent('purchase', {
      transaction_id: order.orderNumber,
      currency: 'PKR',
      value: order.total,
      items: order.items.map((item) => ({
        item_id: item.id,
        item_name: item.productName,
        price: item.unitPrice,
        quantity: item.quantity,
      })),
    }),
  customizerStarted: () => trackEvent('customizer_started'),
  designUploaded: () => trackEvent('design_uploaded'),
  customDesignCompleted: () => trackEvent('custom_design_completed'),
  customItemAddedToCart: () => trackEvent('custom_item_added_to_cart'),
  customOrderCreated: (order: { orderNumber: string }) =>
    trackEvent('custom_order_created', { transaction_id: order.orderNumber }),
};