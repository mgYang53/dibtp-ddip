import { NotificationPayload, NotificationType } from '@web/types';

// 공통 아이콘 경로
const DEFAULT_NOTIFICATION_ICON = '/images/android-chrome-192x192.png';
const DEFAULT_NOTIFICATION_BADGE = '/images/badge-icon.png';

// 각 알림 타입별 생성 함수의 파라미터 타입
type NotificationBuilderParams = {
  AUCTION_SOLD: {
    productId: string;
    productName: string;
    finalPrice: number;
  };
  NEW_MESSAGE: {
    chatRoomId: string;
    senderName: string;
    messagePreview: string;
  };
  PRICE_DROP: {
    productId: string;
    productName: string;
    currentPrice: number;
    previousPrice?: number;
  };
  SYSTEM_ANNOUNCEMENT: {
    title: string;
    message: string;
    actionUrl?: string;
  };
};

// 알림 생성 함수 타입
type NotificationBuilder<T extends keyof NotificationBuilderParams> = (
  params: NotificationBuilderParams[T]
) => NotificationPayload;

// 각 알림 타입별 생성 함수
const NOTIFICATION_CONFIGS: {
  [K in NotificationType]: NotificationBuilder<K>;
} = {
  AUCTION_SOLD: ({ productId, productName, finalPrice }) => ({
    title: '경매 낙찰 완료!',
    body: `${productName}이(가) ${finalPrice.toLocaleString()}원에 낙찰되었습니다.`,
    icon: DEFAULT_NOTIFICATION_ICON,
    badge: DEFAULT_NOTIFICATION_BADGE,
    data: {
      type: 'AUCTION_SOLD',
      productId,
      url: `/products/${productId}`,
    },
    actions: [
      {
        action: 'view',
        title: '상품 보기',
      },
      {
        action: 'chat',
        title: '채팅하기',
      },
    ],
  }),

  NEW_MESSAGE: ({ chatRoomId, senderName, messagePreview }) => ({
    title: `${senderName}님의 메시지`,
    body: messagePreview,
    icon: DEFAULT_NOTIFICATION_ICON,
    badge: DEFAULT_NOTIFICATION_BADGE,
    data: {
      type: 'NEW_MESSAGE',
      chatRoomId,
      url: `/chat/${chatRoomId}`,
    },
    actions: [
      {
        action: 'reply',
        title: '답장하기',
      },
      {
        action: 'view',
        title: '채팅방 열기',
      },
    ],
  }),

  PRICE_DROP: ({ productId, productName, currentPrice, previousPrice }) => ({
    title: '가격 하락 알림',
    body: previousPrice
      ? `${productName}의 가격이 ${previousPrice.toLocaleString()}원 → ${currentPrice.toLocaleString()}원으로 하락했습니다!`
      : `${productName}의 현재 가격: ${currentPrice.toLocaleString()}원`,
    icon: DEFAULT_NOTIFICATION_ICON,
    badge: DEFAULT_NOTIFICATION_BADGE,
    data: {
      type: 'PRICE_DROP',
      productId,
      url: `/products/${productId}`,
    },
    actions: [
      {
        action: 'view',
        title: '상품 보기',
      },
      {
        action: 'bid',
        title: '입찰하기',
      },
    ],
  }),

  SYSTEM_ANNOUNCEMENT: ({ title, message, actionUrl }) => ({
    title,
    body: message,
    icon: DEFAULT_NOTIFICATION_ICON,
    badge: DEFAULT_NOTIFICATION_BADGE,
    data: {
      type: 'SYSTEM_ANNOUNCEMENT',
      url: actionUrl,
    },
    actions: actionUrl
      ? [
          {
            action: 'view',
            title: '자세히 보기',
          },
        ]
      : undefined,
  }),
} as const;

// 타입 안전한 알림 생성 헬퍼 함수
export const createNotification = <T extends NotificationType>(
  type: T,
  params: NotificationBuilderParams[T]
): NotificationPayload => {
  return NOTIFICATION_CONFIGS[type](params);
};
