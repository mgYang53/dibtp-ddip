import { API_ROUTES } from '@web/constants';
import { unsubscribeFromPush, getCurrentSubscription } from '@web/utils/notifications';

export const removePushSubscription = async () => {
  // 1. 현재 구독 정보 가져오기
  const subscription = await getCurrentSubscription();
  if (!subscription) return;

  // 2. 서버에서 구독 삭제
  const response = await fetch(API_ROUTES.PUSH.SUBSCRIPTIONS, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ endpoint: subscription.endpoint }),
  });

  if (!response.ok) {
    throw new Error('Failed to unsubscribe from server');
  }

  // 3. 브라우저에서 구독 해제
  await unsubscribeFromPush();
};
