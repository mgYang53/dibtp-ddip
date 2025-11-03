/**
 * PWA 설치 배너 관련 localStorage 키
 */
export const PWA_STORAGE_KEYS = {
  BANNER_DISMISSED: 'pwa_install_banner_dismissed',
  DISMISS_COUNT: 'pwa_install_banner_dismiss_count',
  LAST_DISMISSED_AT: 'pwa_install_banner_last_dismissed_at',
  INSTALLED: 'pwa_installed',
} as const;

/**
 * 배너 숨김 만료 시간 (7일)
 */
export const BANNER_DISMISS_EXPIRY_DAYS = 7;

/**
 * 최대 허용 취소 횟수 (3회 취소 시 영구 숨김)
 */
export const MAX_BANNER_DISMISS_COUNT = 3;
