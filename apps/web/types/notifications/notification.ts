// Prisma에서 생성된 Enum 타입 import
import type { NotificationType } from '@web/lib/prisma/generated/prisma';

export type { NotificationType };

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: {
    type: NotificationType;
    productId?: string;
    chatRoomId?: string;
    url?: string; // 클릭 시 이동할 URL
  };
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export interface SendNotificationParams {
  userId: string;
  notification: NotificationPayload;
  saveToDb?: boolean; // DB에 알림 이력 저장 여부 (기본: true)
}

// 알림 권한 상태
export type NotificationPermissionStatus = 'granted' | 'denied' | 'default';
