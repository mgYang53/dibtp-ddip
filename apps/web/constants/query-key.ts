import type { ProductStatus, GetChatRoomsAPIRequest } from '@web/types';

export const QUERY_KEY = {
  // 사용자 전역 정보 prefetch하는 데이터 관련
  MY_INFO: ['my-info'] as const,

  // 사용자 상품 관련
  MY_PRODUCTS: {
    ALL: ['my-products'] as const,
    BY_STATUS: (status?: ProductStatus) => ['my-products', status] as const,
  } as const,

  // 사용자 채팅방 관련
  CHAT_ROOM: {
    LIST: (request: GetChatRoomsAPIRequest) =>
      ['chat', 'rooms', 'list', ...Object.values(request)] as const,
    LIST_BY_PRODUCT: (userId: string, productId: number) =>
      ['chat', 'rooms', userId, 'list', 'product', productId] as const,
    DETAIL: (userId: string, chatRoomId: string) =>
      ['chat', 'rooms', userId, 'detail', chatRoomId] as const,
    MESSAGES: (chatRoomId: string) => ['chat', 'rooms', 'messages', chatRoomId] as const,
  } as const,

  // 푸시 알림 관련
  PUSH_SUBSCRIPTION_STATUS: ['push-subscription-status'] as const,
};

// ** TODO: 점진적 마이그레이션을 위한 레거시 상수 관리 **
export const MY_INFO_QUERY_KEY = QUERY_KEY.MY_INFO;
export const MY_PRODUCTS_QUERY_KEY = QUERY_KEY.MY_PRODUCTS;
export const CHAT_ROOM_QUERY_KEY = QUERY_KEY.CHAT_ROOM;

// 유저 정보 관련
export const USER_INFO_QUERY_KEY = (userId: string) => ['user-info', userId] as const;

// 사용자 입찰 관련
export const BID_HISTORY_QUERY_KEY = ['bid-history'] as const;
