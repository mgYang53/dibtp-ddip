'use client';

import { Button, IconButton } from '@repo/ui/components';

interface BannerProps {
  title: string; // 배너 제목
  description: string; // 배너 설명 텍스트
  id: string; // 배너 식별자 (data-* 속성 및 접근성 ID용)
  onDismiss: () => void; // 닫기 버튼 클릭 핸들러
  actionButton?: {
    // 액션 버튼 (선택적)
    label: string;
    handleClick: () => void;
    disabled?: boolean;
  };
  isVisible?: boolean; // 배너 표시 여부
}

/**
 * 공통 배너 컴포넌트
 * PWA 설치, 푸시 알림 권한 요청 등 다양한 용도로 사용되는 배너 컴포넌트
 */
const Banner = ({
  title,
  description,
  id,
  onDismiss,
  actionButton,
  isVisible = true,
}: BannerProps) => {
  if (!isVisible) {
    return null;
  }

  return (
    <aside
      data-banner={id}
      className="fixed bottom-[var(--space-container)] left-[var(--space-container)] right-[var(--space-container)] bg-bg-primary p-container rounded-lg shadow-lg z-50"
      role="alert"
      aria-live="polite"
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
    >
      <div className="flex flex-col gap-md">
        <div className="flex items-start gap-md">
          <div className="flex-1 text-text-inverse">
            <h3 id={`${id}-title`} className="font-style-large">
              {title}
            </h3>
            <p id={`${id}-description`} className="font-style-small mt-1">
              {description}
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

        {actionButton && (
          <Button
            color="lightMode"
            size="md"
            onClick={actionButton.handleClick}
            disabled={actionButton.disabled}
            isFullWidth={false}
          >
            {actionButton.label}
          </Button>
        )}
      </div>
    </aside>
  );
};

export default Banner;
