import { detectBrowser, detectPlatform, type BrowserType } from '@/utils/common';

/**
 * PWA 설치 방법 타입
 */
export type InstallMethod =
  | 'beforeinstallprompt' // Chrome 계열 자동 프롬프트
  | 'manual-ios' // iOS 수동 설치 (공유 버튼)
  | 'unsupported'; // 지원 안 함

/**
 * PWA가 이미 설치되어 standalone 모드로 실행 중인지 확인
 */
export const isStandaloneMode = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  // display-mode: standalone 체크
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  // iOS Safari의 경우 추가 체크
  const isIOSStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true;

  return isStandalone || isIOSStandalone;
};

/**
 * Service Worker 지원 여부 확인
 */
export const supportsServiceWorker = (): boolean => {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator;
};

/**
 * beforeinstallprompt 이벤트 지원 여부 (플랫폼 + 브라우저 기반)
 */
export const supportsBeforeInstallPrompt = (): boolean => {
  const platform = detectPlatform();
  const browser = detectBrowser();

  // iOS는 어떤 브라우저든 미지원
  if (platform === 'ios') {
    return false;
  }

  // Android/Desktop에서 Chrome 계열 브라우저만 지원
  const chromiumBrowsers: BrowserType[] = ['chrome', 'edge', 'samsung', 'opera'];
  return chromiumBrowsers.includes(browser);
};

/**
 * 현재 환경의 PWA 설치 방법 감지
 */
export const detectInstallMethod = (): InstallMethod => {
  const platform = detectPlatform();

  // iOS는 무조건 수동 설치
  if (platform === 'ios') {
    return 'manual-ios';
  }

  // Chrome 계열은 자동 프롬프트
  if (supportsBeforeInstallPrompt()) {
    return 'beforeinstallprompt';
  }

  // 나머지는 미지원
  return 'unsupported';
};

/**
 * PWA 관련 플랫폼 정보 반환 (디버깅용)
 */
export const getPWAInfo = () => {
  return {
    platform: detectPlatform(),
    browser: detectBrowser(),
    installMethod: detectInstallMethod(),
    supportsInstallPrompt: supportsBeforeInstallPrompt(),
    isStandalone: isStandaloneMode(),
    supportsServiceWorker: supportsServiceWorker(),
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'N/A',
  };
};
