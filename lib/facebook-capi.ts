import crypto from 'crypto';

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '1751424923304686';
const FB_ACCESS_TOKEN =
  process.env.FB_ACCESS_TOKEN ||
  'EAI67T9cdP98BTNm8DZCIWZBHOYhHSXIiEcmfhnbP8OcZBa0ZC8J66hu0AsoZA1rL1GJuvEDOkhVXKnbhgS3TWqnCdHJ2qGvBRE0FaMvX8EmOpdxkp7KbKsNjZAzQ2GUNsQhZCvK2Vxve7WtZCwxY3V6ZAT5hQ2qvnXL8zFUga6MCYgt8EYG3u1ZCKv9SrCh5TZBYAZDZD';
const FB_TEST_EVENT_CODE = process.env.FB_TEST_EVENT_CODE || 'TEST75453';

function hashData(val?: string | null): string | undefined {
  if (!val || typeof val !== 'string') return undefined;
  const clean = val.trim().toLowerCase();
  if (!clean) return undefined;
  return crypto.createHash('sha256').update(clean).digest('hex');
}

function hashPhone(phone?: string | null): string | undefined {
  if (!phone) return undefined;
  let digits = phone.replace(/[^0-9]/g, '');
  if (digits.startsWith('01')) {
    digits = '88' + digits;
  }
  return hashData(digits);
}

export interface ServerEventData {
  eventName: string;
  eventId?: string;
  eventSourceUrl?: string;
  userData: {
    phone?: string | null;
    email?: string | null;
    fullName?: string | null;
    city?: string | null;
    clientIpAddress?: string | null;
    clientUserAgent?: string | null;
    fbp?: string | null;
    fbc?: string | null;
  };
  customData?: {
    currency?: string;
    value?: number;
    orderId?: string;
    contentType?: string;
    contents?: Array<{
      id: string;
      quantity?: number;
      item_price?: number;
    }>;
  };
}

export async function sendFacebookServerEvent(event: ServerEventData) {
  try {
    if (!FB_PIXEL_ID || !FB_ACCESS_TOKEN) {
      console.warn('[Facebook CAPI] Missing Pixel ID or Access Token.');
      return null;
    }

    const { eventName, eventId, eventSourceUrl, userData, customData } = event;

    const formattedUserData: Record<string, any> = {};

    if (userData.phone) {
      const ph = hashPhone(userData.phone);
      if (ph) formattedUserData.ph = [ph];
    }

    if (userData.email) {
      const em = hashData(userData.email);
      if (em) formattedUserData.em = [em];
    }

    if (userData.fullName) {
      const parts = userData.fullName.trim().split(/\s+/);
      const fn = hashData(parts[0]);
      if (fn) formattedUserData.fn = [fn];
      if (parts.length > 1) {
        const ln = hashData(parts[parts.length - 1]);
        if (ln) formattedUserData.ln = [ln];
      }
    }

    if (userData.city) {
      const ct = hashData(userData.city);
      if (ct) formattedUserData.ct = [ct];
    }

    // Country default BD
    formattedUserData.country = [hashData('bd')];

    if (userData.clientIpAddress) {
      formattedUserData.client_ip_address = userData.clientIpAddress;
    }

    if (userData.clientUserAgent) {
      formattedUserData.client_user_agent = userData.clientUserAgent;
    }

    if (userData.fbp) {
      formattedUserData.fbp = userData.fbp;
    }

    if (userData.fbc) {
      formattedUserData.fbc = userData.fbc;
    }

    const eventPayload: Record<string, any> = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      event_source_url: eventSourceUrl || 'https://girlsglory.com/checkout',
      user_data: formattedUserData
    };

    if (eventId) {
      eventPayload.event_id = eventId;
    }

    if (customData) {
      eventPayload.custom_data = {
        currency: customData.currency || 'BDT',
        value: customData.value || 0,
        order_id: customData.orderId,
        content_type: customData.contentType || 'product',
        contents: customData.contents
      };
    }

    const requestBody: Record<string, any> = {
      data: [eventPayload]
    };

    if (FB_TEST_EVENT_CODE) {
      requestBody.test_event_code = FB_TEST_EVENT_CODE;
    }

    const url = `https://graph.facebook.com/v20.0/${FB_PIXEL_ID}/events?access_token=${FB_ACCESS_TOKEN}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('[Facebook CAPI Error]', data);
    } else {
      console.log(`[Facebook CAPI Success] Event "${eventName}" sent. Received:`, data.events_received);
    }

    return data;
  } catch (error) {
    console.error('[Facebook CAPI Exception]', error);
    return null;
  }
}
