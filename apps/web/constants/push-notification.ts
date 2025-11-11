// 계정 당 최대 구독 수 제한 (DoS 방지)
export const MAX_SUBSCRIPTIONS_PER_USER = 10;

// 푸시 알림 배너 관련 localStorage 키
export const PUSH_BANNER_STORAGE_KEYS = {
  DISMISSED: 'push_banner_dismissed',
  DISMISS_COUNT: 'push_banner_dismiss_count',
  LAST_DISMISSED_AT: 'push_banner_last_dismissed_at',
} as const;

// 배너 숨김 만료 시간 (7일)
export const PUSH_BANNER_DISMISS_EXPIRY_DAYS = 7;

// 최대 허용 취소 횟수 (3회 취소 시 영구 숨김)
export const MAX_PUSH_BANNER_DISMISS_COUNT = 3;
