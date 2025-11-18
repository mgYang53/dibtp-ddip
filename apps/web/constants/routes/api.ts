const API_BASE = '/api';

export const API_ROUTES = {
  // 상품 관련 엔드포인트
  PRODUCTS: `${API_BASE}/products`,
  MY_PRODUCTS: `${API_BASE}/products/my`,
  PRODUCT_STATUS: `${API_BASE}/products/status`,
  PRODUCT_BY_ID: (productId: number) => `${API_BASE}/products/${productId}`,

  // 기타 엔드포인트
  IMAGES: `${API_BASE}/images`,
  BIDS: `${API_BASE}/bids`,
  FAVORITES: `${API_BASE}/favorites`,
  MY_INFO: `${API_BASE}/my-info`,
  USERS: `${API_BASE}/users`,

  // 채팅 관련
  CHAT: {
    ROOMS: `${API_BASE}/chat/rooms`,
    ROOM_DETAIL: `${API_BASE}/chat/room/detail`,
    MESSAGES: (request: string) => `${API_BASE}/chat/messages?${request}`,
    SEND_MESSAGE: `${API_BASE}/chat/messages/send`,
    MARK_AS_READ: `${API_BASE}/chat/messages/read`,
  },

  // 푸시 알림 관련
  PUSH: {
    SUBSCRIPTIONS: `${API_BASE}/push/subscriptions`,
  },
} as const;
