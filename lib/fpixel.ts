export const FB_PIXEL_ID =
  process.env.NEXT_PUBLIC_FB_PIXEL_ID || '1751424923304686';

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

// Track PageView
export const pageview = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

// Track standard or custom event with optional eventID for deduplication
export const event = (
  name: string,
  options: Record<string, any> = {},
  eventId?: string
) => {
  if (typeof window !== 'undefined' && window.fbq) {
    if (eventId) {
      window.fbq('track', name, options, { eventID: eventId });
    } else {
      window.fbq('track', name, options);
    }
  }
};

// Standard Ecommerce Events

export const trackViewContent = (product: {
  id: string;
  name: string;
  category?: string;
  price: number;
}) => {
  event('ViewContent', {
    content_name: product.name,
    content_category: product.category || 'General',
    content_ids: [product.id],
    content_type: 'product',
    value: product.price,
    currency: 'BDT'
  });
};

export const trackAddToCart = (item: {
  productId: string;
  name: string;
  price: number;
  quantity?: number;
}) => {
  event('AddToCart', {
    content_name: item.name,
    content_ids: [item.productId],
    content_type: 'product',
    value: item.price * (item.quantity || 1),
    currency: 'BDT'
  });
};

export const trackInitiateCheckout = (
  items: Array<{ productId: string; name: string; price: number; quantity?: number }>,
  subtotal: number
) => {
  event('InitiateCheckout', {
    content_ids: items.map((i) => i.productId),
    content_type: 'product',
    num_items: items.reduce((acc, i) => acc + (i.quantity || 1), 0),
    value: subtotal,
    currency: 'BDT'
  });
};

export const trackPurchase = (order: {
  orderNumber: string;
  grandTotal: number;
  items?: Array<{ productId?: string; name?: string; price?: number; quantity?: number }>;
}) => {
  event(
    'Purchase',
    {
      content_ids: order.items?.map((i) => i.productId || i.name) || [],
      content_type: 'product',
      value: order.grandTotal,
      currency: 'BDT',
      num_items: order.items?.reduce((acc, i) => acc + (i.quantity || 1), 0) || 1
    },
    order.orderNumber // Matching eventID with Conversions API
  );
};

export const trackContact = (type: string = 'WhatsApp') => {
  event('Contact', {
    content_name: type
  });
};

export const trackSearch = (searchQuery: string) => {
  event('Search', {
    search_string: searchQuery
  });
};
