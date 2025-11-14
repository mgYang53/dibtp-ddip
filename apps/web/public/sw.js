/**
 * DDIP PWA Service Worker
 *
 * 실시간 경매 플랫폼에 최적화된 캐시 전략 구현
 * - Cache-First: 정적 에셋 + Next.js 청크 (빠른 로딩)
 * - Stale-While-Revalidate: 이미지 (즉시 표시 + 백그라운드 갱신)
 * - Network-First: HTML (최신 콘텐츠 우선)
 */

// ===== 캐시 버전 및 이름 관리 =====
// v1.3: sw 업데이트 시 클라이언트 알림 기능 추가
const CACHE_VERSION = 'v1.3';
const STATIC_CACHE = `ddip-static-${CACHE_VERSION}`; // 필수 정적 에셋
const CHUNKS_CACHE = `ddip-chunks-${CACHE_VERSION}`; // Next.js 청크 (동적)
const IMAGE_CACHE = `ddip-images-${CACHE_VERSION}`; // 이미지

// ===== 초기 캐싱 리소스 =====
const STATIC_ASSETS = [
  '/',
  '/favicon.ico',
  '/images/android-chrome-192x192.png',
  '/images/android-chrome-512x512.png',
  '/images/ddip_logo.png',
  '/images/ddip_logo.svg',
];

// ===== 설정 =====
const IMAGE_CACHE_MAX_SIZE = 50; // 이미지 캐시 최대 개수
const CHUNKS_CACHE_MAX_SIZE = 100; // 청크 캐시 최대 개수

// ===== Install Event =====
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      const results = await Promise.allSettled(STATIC_ASSETS.map((url) => cache.add(url)));

      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.warn(`[SW] Failed to cache: ${STATIC_ASSETS[index]}`, result.reason);
        }
      });
    })()
  );
});

// ===== Activate Event =====
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      const currentCaches = [STATIC_CACHE, CHUNKS_CACHE, IMAGE_CACHE];

      // 현재 버전이 아닌 모든 캐시 삭제
      await Promise.all(
        cacheNames
          .filter(
            (cacheName) => !currentCaches.includes(cacheName) && cacheName.startsWith('ddip-')
          )
          .map((cacheName) => caches.delete(cacheName))
      );

      await self.clients.claim();
    })()
  );
});

// ===== Fetch Event =====
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // ===== Cross-Origin 처리 =====
  if (url.origin !== self.location.origin) {
    // Supabase 도메인 처리
    if (url.hostname.includes('supabase.co')) {
      // Auth API (/auth/v1/*): 캐싱 없이 직접 네트워크 요청
      // - 로그인/로그아웃/세션 갱신 등은 실시간 처리 필요
      if (url.pathname.includes('/auth/')) {
        return;
      }

      // Storage API: Stale-While-Revalidate 전략으로 이미지 캐싱
      // - 즉시 캐시된 이미지 표시 + 백그라운드에서 갱신
      event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
    }
    return;
  }

  // ===== Next.js Image Optimization 제외 =====
  if (url.pathname.startsWith('/_next/image')) {
    return;
  }

  // ===== API 요청 제외 (실시간 데이터) =====
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // ===== 전략 1: Cache-First (정적 에셋 + Next.js 청크) =====
  // Next.js 청크 포함 이유:
  // - contenthash로 파일명이 고유하여 버전 충돌 불가능
  // - 브라우저 HTTP 캐시보다 안정적 (LRU 삭제 없음)
  // - 3ms 일관적 응답 속도 보장
  // - 오프라인 지원 가능
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'font' ||
    url.pathname.match(/\.(js|css|woff2)$/)
  ) {
    // Next.js 청크는 별도 캐시에 저장
    const cacheName = url.pathname.startsWith('/_next/static/chunks/')
      ? CHUNKS_CACHE
      : STATIC_CACHE;

    event.respondWith(cacheFirst(request, cacheName));
    return;
  }

  // ===== 전략 2: Stale-While-Revalidate (이미지) =====
  if (
    request.destination === 'image' ||
    url.pathname.startsWith('/images/') ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp)$/)
  ) {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
    return;
  }

  // ===== 전략 3: Network-First (HTML 문서) =====
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(fetch(request).catch(() => caches.match('/')));
    return;
  }

  // ===== 전략 4: 기본 (Network-First with Cache Fallback) =====
  event.respondWith(fetch(request).catch(() => caches.match(request)));
});

// ===== 캐시 전략 구현 함수들 =====

/**
 * Cache-First 전략 (개선)
 *
 * @param {Request} request - 네트워크 요청 객체
 * @param {string} cacheName - 사용할 캐시 이름
 */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    const url = new URL(request.url);

    // HTTP/HTTPS 스킴이고 응답이 정상(200-299)일 때만 캐싱
    if (response.ok && (url.protocol === 'http:' || url.protocol === 'https:')) {
      await cache.put(request, response.clone());

      // 청크 캐시 크기 제한
      if (cacheName === CHUNKS_CACHE) {
        await limitCacheSize(CHUNKS_CACHE, CHUNKS_CACHE_MAX_SIZE);
      }
    }

    return response;
  } catch (error) {
    console.error('[SW] Cache-First failed:', request.url, error);

    // 네트워크 실패 시 캐시 재확인 (race condition 대비)
    const fallback = await cache.match(request);
    if (fallback) return fallback;

    throw error;
  }
}

/**
 * Stale-While-Revalidate 전략
 *
 * @param {Request} request - 네트워크 요청 객체
 * @param {string} cacheName - 사용할 캐시 이름
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  // 백그라운드 네트워크 요청
  const fetchPromise = (async () => {
    try {
      const response = await fetch(request);
      const url = new URL(request.url);

      if (response.ok && (url.protocol === 'http:' || url.protocol === 'https:')) {
        await cache.put(request, response.clone());
        await limitCacheSize(cacheName, IMAGE_CACHE_MAX_SIZE);
      }
      return response;
    } catch (error) {
      console.warn('[SW] Background fetch failed:', request.url, error);
      return cached;
    }
  })();

  return cached || fetchPromise;
}

/**
 * 캐시 크기 제한
 *
 * @param {string} cacheName - 캐시 이름
 * @param {number} maxItems - 최대 캐시 항목 수
 */
async function limitCacheSize(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > maxItems) {
    const keysToDelete = keys.slice(0, keys.length - maxItems);
    await Promise.all(keysToDelete.map((key) => cache.delete(key)));
  }
}

/**
 * Network-First with Timeout 전략
 * (현재 미사용 - 향후 정적 API 추가 시 사용 가능)
 *
 * @param {Request} request - 네트워크 요청 객체
 * @param {string} cacheName - 사용할 캐시 이름
 * @param {number} timeout - 타임아웃 (밀리초, 기본 3초)
 */
async function networkFirstWithTimeout(request, cacheName, timeout = 3000) {
  const cache = await caches.open(cacheName);

  try {
    const response = await Promise.race([
      fetch(request),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Network timeout')), timeout)),
    ]);

    const url = new URL(request.url);
    if (response.ok && (url.protocol === 'http:' || url.protocol === 'https:')) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

// ===== Service Worker 업데이트 알림 =====
/**
 * SKIP_WAITING 메시지 처리
 * - 클라이언트로부터 SKIP_WAITING 메시지를 수신하면 즉시 활성화
 */
self.addEventListener('message', (event) => {
  // 이벤트 소스 검증 (보안)
  if (!event.source) {
    console.warn('[SW] Received message without source');
    return;
  }

  if (event.data && event.data.type === 'SKIP_WAITING') {
    try {
      self.skipWaiting();
    } catch (error) {
      console.error('[SW] skipWaiting() failed:', error);
    }
  }
});

// ===== Phase 5: 푸시 알림 =====
// TODO: push 이벤트 리스너 추가
// TODO: notificationclick 이벤트 리스너 추가
