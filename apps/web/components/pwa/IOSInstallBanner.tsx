'use client';

import { Banner } from '@web/components/shared';

interface IOSInstallBannerProps {
  onDismiss: () => void;
}

/**
 * iOS Safari용 PWA 설치 안내 배너
 * Safari는 beforeinstallprompt를 지원하지 않으므로 수동 안내 제공
 */
export const IOSInstallBanner = ({ onDismiss }: IOSInstallBannerProps) => {
  return (
    <Banner
      id="pwa-install-ios"
      title="앱을 홈 화면에 추가해 보세요!"
      description='공유 버튼을 누른 후 "홈 화면에 추가" 를 선택하세요.'
      onDismiss={onDismiss}
    />
  );
};
