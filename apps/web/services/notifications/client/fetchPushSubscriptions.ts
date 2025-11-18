import { API_ROUTES } from '@web/constants';
import type { PushSubscriptionsStatus } from '@web/types';

// 사용자의 푸시 알림 구독 목록을 조회하는 클라이언트 서비스 함수
export const fetchPushSubscriptions = async (): Promise<PushSubscriptionsStatus> => {
  const response = await fetch(API_ROUTES.PUSH.SUBSCRIPTIONS, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '푸시 알림 구독 목록 조회에 실패했습니다');
  }

  return response.json();
};
