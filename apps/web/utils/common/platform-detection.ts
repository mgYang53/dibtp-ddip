// 현재 플랫폼 타입
type PlatformType = 'ios' | 'android' | 'desktop' | 'unknown';

/**
 * 브라우저 타입
 */
export type BrowserType =
  | 'chrome'
  | 'safari'
  | 'firefox'
  | 'edge'
  | 'samsung'
  | 'opera'
  | 'unknown';

/**
 * 현재 플랫폼 감지
 * iOS, Android, Desktop을 구분하여 반환
 */
export const detectPlatform = (): PlatformType => {
  if (typeof window === 'undefined') {
    return 'unknown';
  }

  const userAgent =
    navigator.userAgent ||
    navigator.vendor ||
    (window as unknown as { opera?: string }).opera ||
    '';

  // iOS 감지 (iPad, iPhone, iPod)
  const isIOS =
    /iPad|iPhone|iPod/.test(userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
  if (isIOS) {
    return 'ios';
  }

  // Android 감지
  const isAndroid = /android/i.test(userAgent);
  if (isAndroid) {
    return 'android';
  }

  // Desktop (Mac, Windows, Linux 등)
  return 'desktop';
};

/**
 * 브라우저 타입 감지
 */
export const detectBrowser = (): BrowserType => {
  if (typeof window === 'undefined') {
    return 'unknown';
  }

  const userAgent = navigator.userAgent.toLowerCase();

  // Edge (Chromium 기반)
  if (userAgent.includes('edg/')) {
    return 'edge';
  }

  // Samsung Internet
  if (userAgent.includes('samsungbrowser')) {
    return 'samsung';
  }

  // Chrome (Edge와 Samsung이 아닌 경우)
  if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
    return 'chrome';
  }

  // Safari (Chrome이 아닌 경우)
  if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
    return 'safari';
  }

  // Firefox
  if (userAgent.includes('firefox')) {
    return 'firefox';
  }

  // Opera
  if (userAgent.includes('opr/') || userAgent.includes('opera')) {
    return 'opera';
  }

  return 'unknown';
};

/**
 * iOS 기기 여부 확인
 */
export const isIOSDevice = (): boolean => {
  return detectPlatform() === 'ios';
};

/**
 * Android 기기 여부 확인
 */
export const isAndroidDevice = (): boolean => {
  return detectPlatform() === 'android';
};

/**
 * Desktop 환경 여부 확인
 */
export const isDesktopDevice = (): boolean => {
  return detectPlatform() === 'desktop';
};

/**
 * 모바일 기기 여부 확인 (iOS 또는 Android)
 */
export const isMobileDevice = (): boolean => {
  const platform = detectPlatform();
  return platform === 'ios' || platform === 'android';
};
