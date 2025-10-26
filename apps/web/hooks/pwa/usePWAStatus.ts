import { useState } from 'react';

import {
  detectInstallMethod,
  isStandaloneMode,
  supportsServiceWorker,
  type InstallMethod,
} from '@/utils/pwa';

/**
 * PWA 상태 감지 Hook
 *
 * 현재 PWA 실행 상태, 설치 방법, 지원 여부를 확인합니다.
 * 초기 마운트 시점에 한 번만 감지하며, 이후 변경되지 않습니다.
 *
 * @returns {Object} PWA 상태 정보
 * @returns {boolean} isStandalone - PWA가 standalone 모드로 실행 중인지 여부
 * @returns {InstallMethod} installMethod - 플랫폼 및 브라우저에 따른 설치 방법
 * @returns {boolean} isSupported - Service Worker 지원 여부
 *
 * @example
 * ```tsx
 * const { isStandalone, installMethod, isSupported } = usePWAStatus();
 *
 * if (isStandalone) {
 *   // 이미 PWA로 설치되어 실행 중
 *   return <div>PWA 모드로 실행 중입니다</div>;
 * }
 *
 * if (installMethod === 'manual-ios') {
 *   // iOS Safari - 수동 설치 안내 필요
 *   return <IOSInstallGuide />;
 * }
 *
 * if (installMethod === 'beforeinstallprompt') {
 *   // Chrome/Edge - 자동 프롬프트 사용 가능
 *   return <InstallButton />;
 * }
 * ```
 */
export const usePWAStatus = () => {
  /**
   * PWA가 standalone 모드로 실행 중인지 확인
   * - display-mode: standalone
   * - iOS navigator.standalone
   */
  const [isStandalone] = useState(() => isStandaloneMode());

  /**
   * 플랫폼 및 브라우저에 따른 설치 방법 감지
   * - 'beforeinstallprompt': Chrome/Edge (자동 프롬프트)
   * - 'manual-ios': iOS Safari (수동 설치 안내)
   * - 'unsupported': 지원하지 않는 환경
   */
  const [installMethod] = useState<InstallMethod>(() => detectInstallMethod());

  /**
   * Service Worker 지원 여부
   * PWA의 기본 요구사항
   */
  const [isSupported] = useState(() => supportsServiceWorker());

  return {
    isStandalone,
    installMethod,
    isSupported,
  };
};
