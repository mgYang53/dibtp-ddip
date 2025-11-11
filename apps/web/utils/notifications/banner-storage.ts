import {
  PUSH_BANNER_STORAGE_KEYS,
  PUSH_BANNER_DISMISS_EXPIRY_DAYS,
  MAX_PUSH_BANNER_DISMISS_COUNT,
} from '@web/constants';

/**
 * 푸시 알림 배너가 현재 숨김 상태인지 확인
 */
export const isPushBannerDismissed = (): boolean => {
  if (typeof window === 'undefined') {
    return true;
  }

  try {
    // 취소 횟수 확인
    const dismissCount = getPushBannerDismissCount();
    if (dismissCount >= MAX_PUSH_BANNER_DISMISS_COUNT) {
      return true;
    }

    // 배너 닫힘 여부 확인
    const dismissed = localStorage.getItem(PUSH_BANNER_STORAGE_KEYS.DISMISSED);
    if (dismissed !== 'true') {
      return false;
    }

    // 마지막 닫은 시간 확인
    const lastDismissedAt = localStorage.getItem(PUSH_BANNER_STORAGE_KEYS.LAST_DISMISSED_AT);
    if (!lastDismissedAt) {
      return false;
    }

    // 만료 시간 계산
    const lastDismissedTime = new Date(lastDismissedAt).getTime();
    // 유효하지 않은 날짜인 경우 상태 초기화
    if (Number.isNaN(lastDismissedTime)) {
      localStorage.removeItem(PUSH_BANNER_STORAGE_KEYS.DISMISSED);
      localStorage.removeItem(PUSH_BANNER_STORAGE_KEYS.LAST_DISMISSED_AT);
      return false;
    }

    const now = Date.now();
    const expiryTime = PUSH_BANNER_DISMISS_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

    // 만료되었으면 다시 표시
    if (now - lastDismissedTime > expiryTime) {
      localStorage.removeItem(PUSH_BANNER_STORAGE_KEYS.DISMISSED);
      localStorage.removeItem(PUSH_BANNER_STORAGE_KEYS.LAST_DISMISSED_AT);
      return false;
    }

    return true;
  } catch (error) {
    console.warn('[Push Notification] Failed to access localStorage:', error);
    return false;
  }
};

/**
 * 푸시 알림 배너를 닫음 상태로 설정하고 취소 횟수 증가
 */
export const dismissPushBanner = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(PUSH_BANNER_STORAGE_KEYS.DISMISSED, 'true');
    localStorage.setItem(PUSH_BANNER_STORAGE_KEYS.LAST_DISMISSED_AT, new Date().toISOString());

    // 취소 횟수 증가
    const currentCount = getPushBannerDismissCount();
    localStorage.setItem(PUSH_BANNER_STORAGE_KEYS.DISMISS_COUNT, String(currentCount + 1));
  } catch (error) {
    console.warn('[Push Notification] Failed to save banner dismiss state:', error);
  }
};

/**
 * 푸시 알림 배너 취소 횟수 조회
 */
const getPushBannerDismissCount = (): number => {
  if (typeof window === 'undefined') {
    return 0;
  }

  try {
    const count = localStorage.getItem(PUSH_BANNER_STORAGE_KEYS.DISMISS_COUNT);
    return count ? parseInt(count, 10) || 0 : 0;
  } catch (error) {
    return 0;
  }
};

/**
 * 푸시 알림 구독 성공 시 배너 상태 초기화
 */
export const clearPushBannerDismissState = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(PUSH_BANNER_STORAGE_KEYS.DISMISSED);
    localStorage.removeItem(PUSH_BANNER_STORAGE_KEYS.LAST_DISMISSED_AT);
    localStorage.removeItem(PUSH_BANNER_STORAGE_KEYS.DISMISS_COUNT);
  } catch (error) {
    console.warn('[Push Notification] Failed to clear banner dismiss state:', error);
  }
};
