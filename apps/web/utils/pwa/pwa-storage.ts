import {
  BANNER_DISMISS_EXPIRY_DAYS,
  MAX_BANNER_DISMISS_COUNT,
  PWA_STORAGE_KEYS,
} from '@/constants';

/**
 * 배너가 현재 숨김 상태인지 확인
 * - 사용자가 닫았거나
 * - 이미 설치했거나
 * - 취소 횟수가 최대치를 초과한 경우
 */
export const isBannerDismissed = (): boolean => {
  if (typeof window === 'undefined') {
    return true;
  }

  try {
    // 이미 설치된 경우
    const installed = localStorage.getItem(PWA_STORAGE_KEYS.INSTALLED);
    if (installed === 'true') {
      return true;
    }

    // 취소 횟수 확인
    const dismissCount = getDismissCount();
    if (dismissCount >= MAX_BANNER_DISMISS_COUNT) {
      return true;
    }

    // 배너 닫힘 여부 확인
    const dismissed = localStorage.getItem(PWA_STORAGE_KEYS.BANNER_DISMISSED);
    if (dismissed !== 'true') {
      return false;
    }

    // 마지막 닫은 시간 확인
    const lastDismissedAt = localStorage.getItem(PWA_STORAGE_KEYS.LAST_DISMISSED_AT);
    if (!lastDismissedAt) {
      return false;
    }

    // 만료 시간 계산
    const lastDismissedTime = new Date(lastDismissedAt).getTime();
    const now = Date.now();
    const expiryTime = BANNER_DISMISS_EXPIRY_DAYS * 24 * 60 * 60 * 1000; // 밀리초로 변환

    // 만료되었으면 다시 표시
    if (now - lastDismissedTime > expiryTime) {
      localStorage.removeItem(PWA_STORAGE_KEYS.BANNER_DISMISSED);
      localStorage.removeItem(PWA_STORAGE_KEYS.LAST_DISMISSED_AT);
      return false;
    }

    return true;
  } catch (error) {
    // localStorage 접근 실패 시 (Safari private mode 등)
    // eslint-disable-next-line no-console
    console.warn('[PWA] Failed to access localStorage:', error);
    return false;
  }
};

/**
 * 배너를 닫음 상태로 설정하고 취소 횟수 증가
 */
export const dismissBanner = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(PWA_STORAGE_KEYS.BANNER_DISMISSED, 'true');
    localStorage.setItem(PWA_STORAGE_KEYS.LAST_DISMISSED_AT, new Date().toISOString());

    // 취소 횟수 증가
    const currentCount = getDismissCount();
    localStorage.setItem(PWA_STORAGE_KEYS.DISMISS_COUNT, String(currentCount + 1));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('[PWA] Failed to save banner dismiss state:', error);
  }
};

/**
 * 현재까지의 배너 취소 횟수 조회 (내부 전용)
 */
const getDismissCount = (): number => {
  if (typeof window === 'undefined') {
    return 0;
  }

  try {
    const count = localStorage.getItem(PWA_STORAGE_KEYS.DISMISS_COUNT);
    return count ? parseInt(count, 10) || 0 : 0;
  } catch (error) {
    return 0;
  }
};

/**
 * PWA 설치 완료 상태로 설정
 * 배너를 영구적으로 숨김
 */
export const markAsInstalled = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(PWA_STORAGE_KEYS.INSTALLED, 'true');
    localStorage.removeItem(PWA_STORAGE_KEYS.BANNER_DISMISSED);
    localStorage.removeItem(PWA_STORAGE_KEYS.LAST_DISMISSED_AT);
    localStorage.removeItem(PWA_STORAGE_KEYS.DISMISS_COUNT);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('[PWA] Failed to mark as installed:', error);
  }
};
