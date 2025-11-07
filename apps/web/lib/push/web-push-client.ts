import * as webpush from 'web-push';

import { ensureVapidKeys } from './config';

// VAPID 키 초기화 상태
let isInitialized = false;

/**
 * VAPID 키를 검증하고 web-push 클라이언트를 초기화합니다.
 * 실제 사용 시점에 호출되어 lazy initialization을 구현합니다.
 */
function initializeWebPush(): void {
  if (isInitialized) return;

  const { publicKey, privateKey, subject } = ensureVapidKeys();
  webpush.setVapidDetails(subject, publicKey, privateKey);
  isInitialized = true;
}

/**
 * Lazy initialization을 지원하는 web-push 클라이언트
 * - 메서드 호출 시점에 VAPID 키를 검증하고 초기화
 * - VAPID 키가 없어도 import는 가능 (다른 기능 개발 가능)
 */
export const webPushClient = new Proxy(webpush, {
  get(target, prop, receiver) {
    const value = Reflect.get(target, prop, receiver);

    // 함수인 경우 호출 전에 초기화
    if (typeof value === 'function') {
      return function (this: any, ...args: any[]) {
        initializeWebPush();
        return Reflect.apply(value, this, args);
      };
    }

    return value;
  },
});
