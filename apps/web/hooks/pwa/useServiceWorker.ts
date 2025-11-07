'use client';

import { useEffect } from 'react';

import { supportsServiceWorker } from '@web/utils/pwa';

/**
 * Service Worker 등록 및 관리 Hook
 *
 * 컴포넌트 마운트 시 Service Worker를 등록하고,
 * 업데이트를 감지하여 처리합니다.
 */
export const useServiceWorker = () => {
  useEffect(() => {
    // Service Worker 미지원 환경
    if (!supportsServiceWorker()) {
      return;
    }

    // Service Worker 등록
    registerServiceWorker().catch((error) => {
      // eslint-disable-next-line no-console
      console.warn('[PWA] Service Worker registration failed:', error);
    });
  }, []);
};

/**
 * Service Worker 등록 함수
 *
 * /sw.js 파일을 Service Worker로 등록하고,
 * 업데이트 감지 리스너를 설정합니다.
 *
 * @returns {Promise<ServiceWorkerRegistration>}
 */
async function registerServiceWorker(): Promise<ServiceWorkerRegistration> {
  const registration = await navigator.serviceWorker.register('/sw.js', {
    scope: '/',
    updateViaCache: 'none',
  });

  // Service Worker 업데이트 감지
  registration.addEventListener('updatefound', () => {
    const installingWorker = registration.installing;

    if (!installingWorker) {
      return;
    }

    installingWorker.addEventListener('statechange', () => {
      if (installingWorker.state === 'installed') {
        if (navigator.serviceWorker.controller) {
          // 새로운 Service Worker가 대기 중 (업데이트 감지)
          // TODO: 사용자에게 업데이트 알림 표시
          // 예: Toast 메시지나 업데이트 버튼 표시
        }
        // 첫 설치 완료 시에는 별도 처리 불필요 (백그라운드에서 캐시 완료)
      }
    });
  });

  return registration;
}
