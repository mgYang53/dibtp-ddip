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
  // iPad iOS 13+ 데스크톱 모드 감지: maxTouchPoints > 1 체크
  const isIOS =
    (/iPad|iPhone|iPod/.test(userAgent) &&
      !(window as unknown as { MSStream?: unknown }).MSStream) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
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
 * 브라우저 감지 규칙
 * 순서가 중요: 더 구체적인 브라우저를 먼저 체크
 *
 * 참고: Brave, Vivaldi, Arc 등 다른 Chromium 브라우저들은
 * User Agent에 고유 식별자를 포함하지 않으므로 'chrome'으로 감지됩니다.
 * 이는 의도된 동작이며, 모든 Chromium 브라우저는 동일한 PWA 기능을 지원합니다.
 */
const BROWSER_DETECTION_RULES: Array<{
  type: BrowserType;
  test: (ua: string) => boolean;
}> = [
  // Edge (Chromium 기반) - Chrome보다 먼저 체크
  { type: 'edge', test: (ua) => ua.includes('edg/') },
  // Samsung Internet
  { type: 'samsung', test: (ua) => ua.includes('samsungbrowser') },
  // Opera - Chrome보다 먼저 체크
  { type: 'opera', test: (ua) => ua.includes('opr/') || ua.includes('opera') },
  // Chrome (Brave, Vivaldi, Arc 등 다른 Chromium 브라우저 포함)
  { type: 'chrome', test: (ua) => ua.includes('chrome') },
  // Firefox
  { type: 'firefox', test: (ua) => ua.includes('firefox') },
  // Safari (Chrome이 아닌 경우에만)
  { type: 'safari', test: (ua) => ua.includes('safari') && !ua.includes('chrome') },
];

/**
 * 브라우저 타입 감지
 */
export const detectBrowser = (): BrowserType => {
  if (typeof window === 'undefined') {
    return 'unknown';
  }

  const userAgent = navigator.userAgent.toLowerCase();

  // 순서대로 규칙을 적용하여 첫 번째 매칭되는 브라우저 반환
  for (const rule of BROWSER_DETECTION_RULES) {
    if (rule.test(userAgent)) {
      return rule.type;
    }
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
