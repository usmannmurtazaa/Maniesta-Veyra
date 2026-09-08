export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
}

export const analyticsEvents = {
  productViewed: (product: any) => trackEvent('view_item', {
    currency: 'PKR',
    value: Number(product.price),
    items: [{ item_id: product.id, item_name: product.name, price: Number(product.price) }],
  }),
  searchPerformed: (query: string) => trackEvent('search', { search_term: query }),
  addToCart: (item: any) => trackEvent('add_to_cart', {
    currency: 'PKR',
    value: Number(item.price) * item.quantity,
    items: [{ item_id: item.id, item_name: item.name, price: Number(item.price), quantity: item.quantity }],
  }),
  removeFromCart: (item: any) => trackEvent('remove_from_cart', {
    currency: 'PKR',
    value: Number(item.price) * item.quantity,
    items: [{ item_id: item.id, item_name: item.name, price: Number(item.price), quantity: item.quantity }],
  }),
  wishlistAdded: (product: any) => trackEvent('add_to_wishlist', { item_id: product.id, item_name: product.name }),
  checkoutStarted: (cart: any) => trackEvent('begin_checkout', {
    currency: 'PKR',
    value: cart.subtotal,
    items: cart.items.map((item: any) => ({ item_id: item.id, item_name: item.name, price: item.unitPrice, quantity: item.quantity })),
  }),
  purchaseCompleted: (order: any) => trackEvent('purchase', {
    transaction_id: order.orderNumber,
    currency: 'PKR',
    value: Number(order.total),
    items: order.items.map((item: any) => ({ item_id: item.id, item_name: item.productName, price: Number(item.unitPrice), quantity: item.quantity })),
  }),
  customizerStarted: () => trackEvent('customizer_started'),
  designUploaded: () => trackEvent('design_uploaded'),
  customDesignCompleted: () => trackEvent('custom_design_completed'),
  customItemAddedToCart: () => trackEvent('custom_item_added_to_cart'),
  customOrderCreated: (order: any) => trackEvent('custom_order_created', { transaction_id: order.orderNumber }),
};