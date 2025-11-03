/**
 * BeforeInstallPromptEvent 인터페이스
 * Chrome, Edge, Samsung Internet에서 지원하는 비표준 API
 * @see https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent
 */
export interface BeforeInstallPromptEvent extends Event {
  /**
   * 이벤트가 발생한 플랫폼 목록을 포함하는 배열
   * 예: "web", "play" 등 사용자에게 선택지를 제공할 때 사용
   */
  readonly platforms: string[];

  /**
   * 사용자의 선택 결과를 담은 Promise
   * "accepted" (수락) 또는 "dismissed" (거절) 값을 반환
   */
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;

  /**
   * 개발자가 원하는 시점에 설치 프롬프트를 표시할 수 있게 하는 메서드
   * Promise를 반환하며, 프롬프트 표시 후 완료됨
   */
  prompt(): Promise<void>;
}
