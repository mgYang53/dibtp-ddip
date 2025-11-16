/**
 * 서버 전용 web-push 클라이언트
 * - VAPID 키 전체 (public + private + subject) 사용
 * - web-push 패키지를 사용 (Node.js 전용)
 */

import * as webpush from 'web-push';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT;

if (
  (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY || !VAPID_SUBJECT) &&
  process.env.NODE_ENV === 'development'
) {
  // eslint-disable-next-line no-console
  console.warn(
    '⚠️  VAPID keys are missing!\n' +
      'Push notifications will not work until you:\n' +
      '1. Run: npx web-push generate-vapid-keys\n' +
      '2. Add NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, and VAPID_SUBJECT to .env\n' +
      '   Example: VAPID_SUBJECT=mailto:your-email@example.com'
  );
}

// VAPID 키 초기화 상태
let isInitialized = false;

/**
 * VAPID 키를 검증하고 web-push 클라이언트를 초기화합니다.
 */
function initializeWebPush(): void {
  if (isInitialized) return;

  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY || !VAPID_SUBJECT) {
    throw new Error(
      '❌ VAPID keys are missing!\n' +
        'Set NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, and VAPID_SUBJECT in .env'
    );
  }

  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  isInitialized = true;
}

/**
 * Lazy initialization을 지원하는 web-push 클라이언트
 * - 메서드 호출 시점에 VAPID 키를 검증하고 초기화
 */
export const webPushClient = new Proxy(webpush, {
  get(target, prop, receiver) {
    const value = Reflect.get(target, prop, receiver);

    if (typeof value === 'function') {
      return function (this: any, ...args: any[]) {
        initializeWebPush();
        return Reflect.apply(value, this, args);
      };
    }

    return value;
  },
});
