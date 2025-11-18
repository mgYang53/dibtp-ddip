/**
 * 클라이언트 전용 VAPID Public Key
 * - 브라우저에서 푸시 구독 시 사용
 * - web-push 패키지를 import하지 않음 (Node.js 모듈 포함 방지)
 */

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

if (!VAPID_PUBLIC_KEY && process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-console
  console.warn(
    '⚠️  VAPID public key is missing!\n' +
      'Push notifications will not work until you:\n' +
      '1. Run: npx web-push generate-vapid-keys\n' +
      '2. Add NEXT_PUBLIC_VAPID_PUBLIC_KEY to .env'
  );
}

export const getVapidPublicKey = () => {
  if (!VAPID_PUBLIC_KEY) {
    throw new Error('❌ VAPID public key is missing!');
  }
  return VAPID_PUBLIC_KEY;
};
