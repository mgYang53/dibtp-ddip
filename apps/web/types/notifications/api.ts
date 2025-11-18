// 구독 목록 조회 응답의 개별 구독 아이템
export interface PushSubscriptionItem {
  endpoint: string;
  device_name: string | null;
  created_at: Date;
  updated_at: Date | null;
  is_active: boolean;
}

// GET /api/push/subscriptions 응답
export interface PushSubscriptionsStatus {
  subscribed: boolean;
  subscriptions: PushSubscriptionItem[];
}
