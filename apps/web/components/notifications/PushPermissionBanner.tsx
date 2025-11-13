'use client';

import { useState, useEffect } from 'react';

import { Banner } from '@web/components/shared';
import { BANNER_DISPLAY_CONFIG, PUSH_BANNER_STORAGE_CONFIG } from '@web/constants';
import { usePushPermission, usePushSubscription } from '@web/hooks';
import { isBannerDismissed, dismissBanner, clearBannerDismissState } from '@web/utils/common';

export const PushPermissionBanner = () => {
  const { isSupported, isDefault, isGranted } = usePushPermission();
  const { subscribe, isSubscribing, isSubscribed } = usePushSubscription();
  const [isVisible, setIsVisible] = useState(false);

  // 배너를 숨겨야 하는지 판단
  const shouldHide =
    isGranted ||
    isSubscribed ||
    !isSupported ||
    !isDefault ||
    isBannerDismissed(PUSH_BANNER_STORAGE_CONFIG);

  useEffect(() => {
    if (shouldHide) {
      setIsVisible(false);
      return;
    }

    // 지연 시간 후 배너 표시 (사용자 경험 고려)
    const timer = setTimeout(() => setIsVisible(true), BANNER_DISPLAY_CONFIG.SHOW_DELAY);
    return () => clearTimeout(timer);
  }, [shouldHide]);

  const handleEnable = async () => {
    try {
      await subscribe();
      setIsVisible(false);
      // 성공 시 dismiss 상태 초기화
      clearBannerDismissState(PUSH_BANNER_STORAGE_CONFIG);
    } catch (error) {
      console.error('Failed to enable push notifications:', error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    dismissBanner(PUSH_BANNER_STORAGE_CONFIG);
  };

  return (
    <Banner
      id="push-notification"
      title="알림 받기"
      description="낙찰 알림과 채팅 메시지를 실시간으로 받아보세요"
      onDismiss={handleDismiss}
      actionButton={{
        label: isSubscribing ? '설정 중...' : '알림 켜기',
        handleClick: handleEnable,
        disabled: isSubscribing,
      }}
      isVisible={isVisible}
    />
  );
};
