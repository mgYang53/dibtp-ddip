import { prisma } from '@web/lib/prisma';
import { webPushClient } from '@web/lib/push/server';
import type { SendNotificationParams } from '@web/types';

export const sendPushNotification = async ({
  userId,
  notification,
  saveToDb = true,
}: SendNotificationParams) => {
  // 1. 사용자의 활성 구독 정보 조회
  const subscriptions = await prisma.push_subscriptions.findMany({
    where: {
      user_id: userId,
      is_active: true, // 활성 구독만
    },
  });

  if (subscriptions.length === 0) {
    return { sent: 0, failed: 0 };
  }

  // 2. 사용자 알림 설정 확인 (선택 사항)
  const preferences = await prisma.notification_preferences.findUnique({
    where: { user_id: userId },
  });

  // 3. 알림 타입별 수신 거부 확인
  if (preferences && notification.data?.type) {
    const typeKey = notification.data.type.toLowerCase();
    if (preferences[typeKey as keyof typeof preferences] === false) {
      return { sent: 0, failed: 0 };
    }
  }

  // 4. 각 디바이스에 푸시 발송
  const results = await Promise.allSettled(
    subscriptions.map(async (sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh_key,
          auth: sub.auth_key,
        },
      };

      try {
        await webPushClient.sendNotification(pushSubscription, JSON.stringify(notification));

        // 발송 성공: last_success_at 업데이트, failure_count 초기화
        await prisma.push_subscriptions.update({
          where: { endpoint: sub.endpoint },
          data: {
            last_success_at: new Date(),
            failure_count: 0,
          },
        });

        return { success: true };
      } catch (error: any) {
        // 410 Gone 또는 404 Not Found: 구독 만료
        if (error.statusCode === 410 || error.statusCode === 404) {
          await prisma.push_subscriptions.delete({
            where: { endpoint: sub.endpoint },
          });
          throw error;
        }

        // 연속 실패 횟수 증가
        const newFailureCount = sub.failure_count + 1;
        await prisma.push_subscriptions.update({
          where: { endpoint: sub.endpoint },
          data: {
            failure_count: newFailureCount,
            last_failure_at: new Date(),
            is_active: newFailureCount >= 3 ? false : sub.is_active, // 3회 실패 시 비활성화
          },
        });

        throw error;
      }
    })
  );

  // 5. 결과 집계
  const sent = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;

  // 6. DB에 알림 이력 저장 (선택 사항)
  if (saveToDb) {
    try {
      await prisma.notifications.create({
        data: {
          user_id: userId,
          type: notification.data?.type || 'SYSTEM_ANNOUNCEMENT',
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          product_id: notification.data?.productId ? BigInt(notification.data.productId) : null,
          chat_room_id: notification.data?.chatRoomId || null,
          is_sent: sent > 0,
          sent_at: sent > 0 ? new Date() : null,
          send_failed: failed > 0,
        },
      });
    } catch (error) {
      console.error('Failed to save notification to DB:', error);
      // DB 저장 실패해도 푸시 발송 성공은 유지
    }
  }

  return { sent, failed };
};
