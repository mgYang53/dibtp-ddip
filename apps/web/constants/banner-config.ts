import type { BannerStorageConfig } from '@web/utils/common';

// PWA 설치 배너 Storage 설정
export const PWA_BANNER_STORAGE_CONFIG: BannerStorageConfig = {
  keys: {
    dismissed: 'pwa_install_banner_dismissed',
    dismissCount: 'pwa_install_banner_dismiss_count',
    lastDismissedAt: 'pwa_install_banner_last_dismissed_at',
    installed: 'pwa_installed',
  },
  dismissExpiryDays: 7,
  maxDismissCount: 3,
} as const;

// 푸시 알림 배너 Storage 설정
export const PUSH_BANNER_STORAGE_CONFIG: BannerStorageConfig = {
  keys: {
    dismissed: 'push_banner_dismissed',
    dismissCount: 'push_banner_dismiss_count',
    lastDismissedAt: 'push_banner_last_dismissed_at',
  },
  dismissExpiryDays: 7,
  maxDismissCount: 3,
} as const;

// 배너 표시 설정
export const BANNER_DISPLAY_CONFIG = {
  // 배너 표시 지연 시간 (밀리초), 사용자 경험을 위해 페이지 로드 후 일정 시간 대기
  SHOW_DELAY: 3000,
} as const;
