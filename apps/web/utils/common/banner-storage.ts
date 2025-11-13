// 배너 Storage 설정 타입
export interface BannerStorageConfig {
  // localStorage 키 prefix
  keys: {
    dismissed: string;
    dismissCount: string;
    lastDismissedAt: string;
    installed?: string; // PWA 전용
  };

  // 배너 숨김 만료 기간 (일)
  dismissExpiryDays: number;

  // 최대 허용 취소 횟수
  maxDismissCount: number;
}

// 배너가 현재 숨김 상태인지 확인
export const isBannerDismissed = (config: BannerStorageConfig): boolean => {
  if (typeof window === 'undefined') {
    return true;
  }

  try {
    // PWA 설치 완료 여부 확인 (PWA 배너만 해당)
    if (config.keys.installed) {
      const installed = localStorage.getItem(config.keys.installed);
      if (installed === 'true') {
        return true;
      }
    }

    // 취소 횟수 확인
    const dismissCount = getDismissCount(config);
    if (dismissCount >= config.maxDismissCount) {
      return true;
    }

    // 배너 닫힘 여부 확인
    const dismissed = localStorage.getItem(config.keys.dismissed);
    if (dismissed !== 'true') {
      return false;
    }

    // 마지막 닫은 시간 확인
    const lastDismissedAt = localStorage.getItem(config.keys.lastDismissedAt);
    if (!lastDismissedAt) {
      return false;
    }

    // 만료 시간 계산
    const lastDismissedTime = new Date(lastDismissedAt).getTime();

    // 유효하지 않은 날짜인 경우 상태 초기화
    if (Number.isNaN(lastDismissedTime)) {
      clearBannerDismissState(config);
      return false;
    }

    const now = Date.now();
    const expiryTime = config.dismissExpiryDays * 24 * 60 * 60 * 1000;

    // 만료되었으면 다시 표시
    if (now - lastDismissedTime > expiryTime) {
      clearBannerDismissState(config);
      return false;
    }

    return true;
  } catch (error) {
    console.warn('[Banner Storage] Failed to access localStorage:', error);
    return false;
  }
};

// 배너를 닫음 상태로 설정하고 취소 횟수 증가
export const dismissBanner = (config: BannerStorageConfig): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(config.keys.dismissed, 'true');
    localStorage.setItem(config.keys.lastDismissedAt, new Date().toISOString());

    // 취소 횟수 증가
    const currentCount = getDismissCount(config);
    localStorage.setItem(config.keys.dismissCount, String(currentCount + 1));
  } catch (error) {
    console.warn('[Banner Storage] Failed to save banner dismiss state:', error);
  }
};

// 배너 닫힘 상태 초기화
export const clearBannerDismissState = (config: BannerStorageConfig): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(config.keys.dismissed);
    localStorage.removeItem(config.keys.lastDismissedAt);
    localStorage.removeItem(config.keys.dismissCount);
  } catch (error) {
    console.warn('[Banner Storage] Failed to clear banner dismiss state:', error);
  }
};

// 설치 완료 상태로 설정 (PWA 전용), 배너를 영구적으로 숨김
export const markBannerAsInstalled = (config: BannerStorageConfig): void => {
  if (typeof window === 'undefined' || !config.keys.installed) {
    return;
  }

  try {
    localStorage.setItem(config.keys.installed, 'true');
    clearBannerDismissState(config);
  } catch (error) {
    console.warn('[Banner Storage] Failed to mark as installed:', error);
  }
};

// 배너 취소 횟수 조회 (내부 전용)
const getDismissCount = (config: BannerStorageConfig): number => {
  if (typeof window === 'undefined') {
    return 0;
  }

  try {
    const count = localStorage.getItem(config.keys.dismissCount);
    return count ? parseInt(count, 10) || 0 : 0;
  } catch (error) {
    return 0;
  }
};
