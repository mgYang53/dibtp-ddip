'use client';

import { useState, useCallback } from 'react';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '@web/constants';

import {
  savePushSubscription,
  removePushSubscription,
  fetchPushSubscriptions,
} from '@web/services/notifications/client';

import { usePushPermission } from './usePushPermission';

export const usePushSubscription = () => {
  const { isGranted, requestPermission } = usePushPermission();
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);

  // 구독 상태 조회 (React Query 사용)
  const { data: status, refetch } = useQuery({
    queryKey: QUERY_KEY.PUSH_SUBSCRIPTION_STATUS,
    queryFn: fetchPushSubscriptions,
    enabled: isGranted, // 권한 있을 때만 조회
  });

  const subscribe = useCallback(
    async (deviceName?: string) => {
      try {
        setIsSubscribing(true);

        // 권한 없으면 먼저 요청
        if (!isGranted) {
          const permission = await requestPermission();
          if (permission !== 'granted') {
            throw new Error('Notification permission denied');
          }
        }

        // 구독 진행
        const result = await savePushSubscription(deviceName);

        // 구독 상태 갱신
        await refetch();

        return result;
      } catch (error) {
        console.error('Failed to subscribe to push:', error);
        throw error;
      } finally {
        setIsSubscribing(false);
      }
    },
    [isGranted, requestPermission, refetch]
  );

  const unsubscribe = useCallback(async () => {
    try {
      setIsUnsubscribing(true);
      await removePushSubscription();

      // 구독 상태 갱신
      await refetch();
    } catch (error) {
      console.error('Failed to unsubscribe from push:', error);
      throw error;
    } finally {
      setIsUnsubscribing(false);
    }
  }, [refetch]);

  return {
    subscribe,
    unsubscribe,
    isSubscribed: status?.subscribed || false,
    subscriptions: status?.subscriptions || [],
    isSubscribing,
    isUnsubscribing,
  };
};
