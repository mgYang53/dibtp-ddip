import { API_ROUTES } from '@web/constants';
import { subscribeToPush } from '@web/utils/notifications';

export const savePushSubscription = async (deviceName?: string) => {
  // 1. 브라우저에서 푸시 구독
  const subscription = await subscribeToPush();

  // 2. 서버에 구독 정보 저장
  const response = await fetch(API_ROUTES.PUSH.SUBSCRIPTIONS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscription, deviceName }),
  });

  if (!response.ok) {
    throw new Error('Failed to save subscription');
  }

  return response.json();
};
