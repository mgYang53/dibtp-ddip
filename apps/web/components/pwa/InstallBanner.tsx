'use client';

import { Button, IconButton } from '@repo/ui/components';

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
    <aside
      data-install-banner="chromium"
      className="fixed bottom-[var(--space-container)] left-[var(--space-container)] right-[var(--space-container)] bg-bg-primary p-container rounded-lg shadow-lg z-50"
      role="dialog"
      aria-labelledby="install-banner-title"
      aria-describedby="install-banner-description"
    >
      <div className="flex flex-col gap-md">
        <div className="flex items-start gap-md">
          <div className="flex-1 text-text-inverse">
            <h3 id="install-banner-title" className="font-style-large">
              앱을 설치해 보세요!
            </h3>
            <p id="install-banner-description" className="font-style-small mt-1">
              홈 화면에 추가하고 더 빠르게 접속하세요.
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

        <Button color="lightMode" size="md" onClick={onInstall} isFullWidth={false}>
          지금 설치
        </Button>
      </div>
    </aside>
  );
};
