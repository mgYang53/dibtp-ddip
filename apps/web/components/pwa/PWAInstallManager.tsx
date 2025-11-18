'use client';

import { useState } from 'react';

import { InstallBanner, IOSInstallBanner } from '@web/components/pwa';
import { PWA_BANNER_STORAGE_CONFIG } from '@web/constants';
import { usePWAInstall, usePWAStatus, useServiceWorker } from '@web/hooks';
import { dismissBanner, isBannerDismissed } from '@web/utils/common';

/**
 * PWA 설치 관리 컴포넌트
 *
 * PWA 설치 배너를 표시하고 관리합니다.
 * - Chrome/Edge: 자동 설치 프롬프트 배너
 * - iOS Safari: 수동 설치 안내 배너
 *
 * 다음 조건에서는 배너를 표시하지 않습니다:
 * - Service Worker 미지원 환경
 * - 이미 standalone 모드로 실행 중
 * - 사용자가 배너를 닫은 경우 (localStorage에 저장)
 */
export const PWAInstallManager = () => {
  // PWA 설치 프롬프트 관리
  const { isInstallable, install } = usePWAInstall();

  // PWA 상태 확인
  const { isStandalone, installMethod, isSupported } = usePWAStatus();

  // Service Worker 등록
  useServiceWorker();

  // 배너 표시 상태 관리
  const [showBanner, setShowBanner] = useState(() => !isBannerDismissed(PWA_BANNER_STORAGE_CONFIG));

  /**
   * 배너 닫기 핸들러
   * localStorage에 닫은 기록을 저장하고 배너를 숨깁니다.
   */
  const handleDismiss = () => {
    setShowBanner(false);
    dismissBanner(PWA_BANNER_STORAGE_CONFIG);
  };

  // Service Worker 미지원 환경
  if (!isSupported) {
    return null;
  }

  // 이미 PWA로 실행 중
  if (isStandalone) {
    return null;
  }

  // 사용자가 배너를 닫은 경우
  if (!showBanner) {
    return null;
  }

  return (
    <>
      {/* iOS Safari - 수동 설치 안내 배너 */}
      {installMethod === 'manual-ios' && <IOSInstallBanner onDismiss={handleDismiss} />}

      {/* Chrome/Edge - 자동 설치 프롬프트 배너 */}
      {installMethod === 'beforeinstallprompt' && isInstallable && (
        <InstallBanner onInstall={install} onDismiss={handleDismiss} />
      )}

      {/* unsupported 환경은 아무것도 표시하지 않음 */}
    </>
  );
};
