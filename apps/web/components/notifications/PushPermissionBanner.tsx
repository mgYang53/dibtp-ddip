'use client';

import { useState, useEffect } from 'react';

import { Button, IconButton } from '@repo/ui/components';

import { usePushPermission, usePushSubscription } from '@web/hooks/notifications';
import {
  isPushBannerDismissed,
  dismissPushBanner,
  clearPushBannerDismissState,
} from '@web/utils/notifications';

export const PushPermissionBanner = () => {
  const { isSupported, isDefault, isGranted } = usePushPermission();
  const { subscribe, isSubscribing, isSubscribed } = usePushSubscription();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 이미 구독했거나 권한 허용했으면 배너 숨김
    if (isGranted || isSubscribed) {
      setIsVisible(false);
      return;
    }

    // 브라우저 미지원 또는 권한이 default가 아니면 숨김
    if (!isSupported || !isDefault) {
      setIsVisible(false);
      return;
    }

    // Dismiss 상태 확인
    if (isPushBannerDismissed()) {
      setIsVisible(false);
      return;
    }

    // 3초 후 배너 표시 (사용자 경험 고려)
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, [isSupported, isDefault, isGranted, isSubscribed]);

  const handleEnable = async () => {
    try {
      await subscribe();
      setIsVisible(false);
      // 성공 시 dismiss 상태 초기화
      clearPushBannerDismissState();
    } catch (error) {
      console.error('Failed to enable push notifications:', error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    dismissPushBanner();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <aside
      data-push-banner="notification"
      className="fixed bottom-[var(--space-container)] left-[var(--space-container)] right-[var(--space-container)] bg-bg-primary p-container rounded-lg shadow-lg z-50"
      role="dialog"
      aria-labelledby="push-banner-title"
      aria-describedby="push-banner-description"
    >
      <div className="flex flex-col gap-md">
        <div className="flex items-start gap-md">
          <div className="flex-1 text-text-inverse">
            <h3 id="push-banner-title" className="font-style-large">
              알림 받기
            </h3>
            <p id="push-banner-description" className="font-style-small mt-1">
              낙찰 알림과 채팅 메시지를 실시간으로 받아보세요
            </p>
          </div>

          <IconButton
            onClick={handleDismiss}
            iconName="Cancel"
            ariaLabel="배너 닫기"
            iconSize="xs"
            buttonSize="xs"
            variant="fulled"
            color="primary"
            className="w-[20px] h-[20px]"
          />
        </div>

        <Button
          color="lightMode"
          size="md"
          onClick={handleEnable}
          disabled={isSubscribing}
          isFullWidth={false}
        >
          {isSubscribing ? '설정 중...' : '알림 켜기'}
        </Button>
      </div>
    </aside>
  );
};
