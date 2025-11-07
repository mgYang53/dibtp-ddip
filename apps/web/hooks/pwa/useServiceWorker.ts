'use client';

import { useEffect } from 'react';

import { toast } from '@repo/ui/components';

import { supportsServiceWorker } from '@web/utils/pwa';

/**
 * Service Worker 등록 및 관리 Hook
 *
 * 컴포넌트 마운트 시 Service Worker를 등록하고,
 * 업데이트를 감지하여 사용자에게 알림을 표시합니다.
 *
 * @see /docs/SW_UPDATE_NOTIFICATION.md
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
          showUpdateNotification(installingWorker);
        }
        // 첫 설치 완료 시에는 별도 처리 불필요 (백그라운드에서 캐시 완료)
      }
    });
  });

  return registration;
}

/**
 * 사용자에게 업데이트 알림 표시
 *
 * @param {ServiceWorker} waitingWorker - 대기 중인 Service Worker
 */
function showUpdateNotification(waitingWorker: ServiceWorker): void {
  // Defensive: waitingWorker null 체크
  if (!waitingWorker) {
    console.warn('[PWA] No waiting worker available');
    return;
  }

  // Toast ID 저장 (특정 toast만 닫기 위함)
  const toastId = toast.info('새로운 버전이 있습니다', {
    action: {
      label: '업데이트',
      onClick: () => {
        toast.dismiss(toastId); // 이 toast만 닫기
        updateServiceWorker(waitingWorker);
      },
    },
    cancel: {
      label: '나중에',
      onClick: () => toast.dismiss(toastId), // 이 toast만 닫기
    },
    duration: Infinity, // 사용자가 직접 닫을 때까지 표시
  });

  console.log('[PWA] Update notification shown to user');
}

/**
 * Service Worker 업데이트 트리거
 *
 * waiting 상태의 Service Worker에게 SKIP_WAITING 메시지를 전송하고,
 * 새로운 컨트롤러가 활성화되면 페이지를 리로드합니다.
 *
 * ⚠️ 중요: controllerchange 리스너를 postMessage 전에 등록!
 * 이유: Race condition 방지 (SW가 매우 빠르게 활성화될 수 있음)
 *
 * @param {ServiceWorker} waitingWorker - 대기 중인 Service Worker
 */
function updateServiceWorker(waitingWorker: ServiceWorker): void {
  console.log('[PWA] Triggering Service Worker update');

  // ✅ STEP 1: controllerchange 리스너 먼저 등록
  navigator.serviceWorker.addEventListener(
    'controllerchange',
    () => {
      console.log('[PWA] New Service Worker activated, reloading page...');
      window.location.reload();
    },
    { once: true } // ✅ 메모리 누수 방지 + 중복 리로드 방지
  );

  // ✅ STEP 2: 리스너 등록 후 메시지 전송
  waitingWorker.postMessage({ type: 'SKIP_WAITING' });
  console.log('[PWA] SKIP_WAITING message sent to Service Worker');
}
