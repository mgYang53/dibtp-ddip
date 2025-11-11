// 환경변수 로드
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:mg960503@gmail.com';

// 개발 환경에서는 warning만 출력 (다른 기능 개발 가능하도록)
if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.warn(
      '⚠️  VAPID keys are missing!\n' +
        'Push notifications will not work until you:\n' +
        '1. Run: npx web-push generate-vapid-keys\n' +
        '2. Add NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY to .env'
    );
  }
}

// VAPID 키 검증 함수 (실제 사용 시점에 체크)
export const ensureVapidKeys = () => {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    throw new Error('❌ VAPID keys are missing!');
  }

  return {
    publicKey: VAPID_PUBLIC_KEY,
    privateKey: VAPID_PRIVATE_KEY,
    subject: VAPID_SUBJECT,
  };
};
