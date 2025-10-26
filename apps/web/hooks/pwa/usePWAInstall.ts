import { useEffect, useState } from 'react';

import type { BeforeInstallPromptEvent } from '@/types';
import { markAsInstalled } from '@/utils/pwa';

/**
 * PWA 설치 프롬프트 관리 Hook
 *
 * beforeinstallprompt 이벤트를 처리하고 설치 프롬프트를 관리합니다.
 * Chrome, Edge, Samsung Internet 등에서 지원됩니다.
 *
 * @returns {Object} PWA 설치 관련 상태 및 함수
 * @returns {boolean} isInstallable - PWA 설치 프롬프트 사용 가능 여부
 * @returns {Function} install - PWA 설치 프롬프트 실행 함수
 */
export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    /**
     * beforeinstallprompt 이벤트 핸들러
     * 브라우저가 PWA 설치 가능 상태임을 알릴 때 발생
     */
    const handleBeforeInstallPrompt = (e: Event) => {
      try {
        // 브라우저 기본 설치 프롬프트 방지
        e.preventDefault();

        // 나중에 사용하기 위해 이벤트 저장
        const promptEvent = e as BeforeInstallPromptEvent;
        setDeferredPrompt(promptEvent);
        setIsInstallable(true);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('[PWA] Error handling beforeinstallprompt:', error);
      }
    };

    /**
     * appinstalled 이벤트 핸들러
     * PWA가 성공적으로 설치되었을 때 발생
     */
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
      markAsInstalled();
    };

    // 이벤트 리스너 등록
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  /**
   * PWA 설치 프롬프트 실행 함수
   *
   * deferredPrompt를 사용하여 브라우저 설치 프롬프트를 표시합니다.
   * 사용자가 수락하거나 거부한 후에는 프롬프트를 초기화합니다.
   *
   * @returns {Promise<void>}
   */
  const install = async () => {
    if (!deferredPrompt) {
      return;
    }

    try {
      // 설치 프롬프트 표시
      await deferredPrompt.prompt();

      // 사용자 선택 결과 대기
      await deferredPrompt.userChoice;

      // 프롬프트는 한 번만 사용 가능하므로 초기화
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('[PWA] Error showing install prompt:', error);
    }
  };

  return {
    isInstallable,
    install,
  };
};
