'use client';

import { useState, useEffect } from 'react';

import { PushPermissionBanner } from '@web/components/notifications';
import { PWAInstallManager } from '@web/components/pwa';
import { PWA_BANNER_STORAGE_CONFIG, PUSH_BANNER_STORAGE_CONFIG } from '@web/constants';
import { usePWAStatus, usePushPermission, usePushSubscription } from '@web/hooks';
import { isBannerDismissed } from '@web/utils/common';

type BannerType = 'pwa' | 'push' | null;

/**
 * 배너 우선순위 관리 컴포넌트
 *
 * PWA 설치 배너와 푸시 알림 배너의 표시 우선순위를 관리합니다.
 * - PWA 배너가 우선순위가 높으며, 닫히면 푸시 배너가 표시됩니다.
 * - 한 번에 하나의 배너만 표시하여 사용자 경험을 개선합니다.
 */
const BannerManager = () => {
  const [activeBanner, setActiveBanner] = useState<BannerType>(null);
  const [pwaWasDismissed, setPwaWasDismissed] = useState(false);

  // PWA 상태 확인
  const { isStandalone, isSupported: isPWASupported } = usePWAStatus();

  // 푸시 알림 상태 확인
  const { isSupported: isPushSupported, isDefault, isGranted } = usePushPermission();
  const { isSubscribed } = usePushSubscription();

  useEffect(() => {
    // PWA 설치 배너 표시 조건 확인
    const shouldShowPWA =
      isPWASupported &&
      !isStandalone &&
      !isBannerDismissed(PWA_BANNER_STORAGE_CONFIG) &&
      !pwaWasDismissed;

    // 푸시 알림 배너 표시 조건 확인
    const shouldShowPush =
      isPushSupported &&
      isDefault &&
      !isGranted &&
      !isSubscribed &&
      !isBannerDismissed(PUSH_BANNER_STORAGE_CONFIG);

    // 배너 우선순위에 따라 표시
    if (shouldShowPWA) {
      setActiveBanner('pwa');
    } else if (shouldShowPush) {
      setActiveBanner('push');
    } else {
      setActiveBanner(null);
    }
  }, [
    isPWASupported,
    isStandalone,
    isPushSupported,
    isDefault,
    isGranted,
    isSubscribed,
    pwaWasDismissed,
  ]);

  /**
   * PWA 배너가 닫혔을 때 호출
   * 푸시 배너를 표시하도록 상태 업데이트
   */
  const handlePWABannerDismissed = () => {
    setPwaWasDismissed(true);
  };

  // PWA 배너를 감싸서 dismiss 이벤트 감지
  const PWABannerWrapper = () => {
    useEffect(() => {
      // PWA 배너가 더 이상 표시되지 않을 때
      const checkDismissed = setInterval(() => {
        if (isBannerDismissed(PWA_BANNER_STORAGE_CONFIG)) {
          handlePWABannerDismissed();
          clearInterval(checkDismissed);
        }
      }, 500);

      return () => clearInterval(checkDismissed);
    }, []);

    return <PWAInstallManager />;
  };

  return (
    <>
      {activeBanner === 'pwa' && <PWABannerWrapper />}
      {activeBanner === 'push' && <PushPermissionBanner />}
    </>
  );
};

export default BannerManager;
