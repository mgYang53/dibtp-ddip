'use client';

import { IconButton } from '@repo/ui/components';

interface IOSInstallBannerProps {
  onDismiss: () => void;
}

/**
 * iOS Safari용 PWA 설치 안내 배너
 * Safari는 beforeinstallprompt를 지원하지 않으므로 수동 안내 제공
 */
export const IOSInstallBanner = ({ onDismiss }: IOSInstallBannerProps) => {
  return (
    <aside
      data-install-banner="ios"
      className="fixed bottom-[var(--space-container)] left-[var(--space-container)] right-[var(--space-container)] bg-bg-primary p-container rounded-lg shadow-lg z-50"
      role="dialog"
      aria-labelledby="ios-install-banner-title"
      aria-describedby="ios-install-banner-description"
    >
      <div className="flex items-start gap-md">
        <div className="flex-1 text-text-inverse">
          <h3 id="ios-install-banner-title" className="font-style-large">
            앱을 홈 화면에 추가해 보세요!
          </h3>
          <p id="ios-install-banner-description" className="font-style-small mt-1">
            공유 버튼을 누른 후 &quot;홈 화면에 추가&quot; 를 선택하세요.
          </p>
        </div>

        <IconButton
          onClick={onDismiss}
          iconName="Cancel"
          ariaLabel="배너 닫기"
          iconSize="xs"
          buttonSize="xs"
          variant="fulled"
          color="primary"
          className="w-[20px] h-[20px]"
        />
      </div>
    </aside>
  );
};
