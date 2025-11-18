'use client';

import { Banner } from '@web/components/shared';

interface InstallBannerProps {
  onInstall: () => void;
  onDismiss: () => void;
}

/**
 * Android/Desktop용 PWA 설치 배너 컴포넌트
 * beforeinstallprompt 이벤트를 지원하는 브라우저에서 표시
 */
export const InstallBanner = ({ onInstall, onDismiss }: InstallBannerProps) => {
  return (
    <Banner
      id="pwa-install-chromium"
      title="앱을 설치해 보세요!"
      description="홈 화면에 추가하고 더 빠르게 접속하세요."
      onDismiss={onDismiss}
      actionButton={{
        label: '지금 설치',
        handleClick: onInstall,
      }}
    />
  );
};
