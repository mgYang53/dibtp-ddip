import { MAX_SUBSCRIPTIONS_PER_USER } from '@web/constants';
import { prisma } from '@web/lib/prisma';
import { PushSubscriptionData } from '@web/types';

interface UpsertPushSubscriptionParams {
  userId: string;
  subscription: PushSubscriptionData;
  deviceName?: string;
  userAgent?: string;
}

export const upsertPushSubscription = async ({
  userId,
  subscription,
  deviceName,
  userAgent,
}: UpsertPushSubscriptionParams) => {
  const { endpoint, keys } = subscription;

  // 기존 구독 수 확인 (DoS 방지)
  const count = await prisma.push_subscriptions.count({
    where: { user_id: userId },
  });

  if (count >= MAX_SUBSCRIPTIONS_PER_USER) {
    // 가장 오래된 구독 삭제
    const oldest = await prisma.push_subscriptions.findFirst({
      where: { user_id: userId },
      orderBy: { updated_at: 'asc' },
    });

    if (oldest) {
      await prisma.push_subscriptions.delete({
        where: { endpoint: oldest.endpoint },
      });
    }
  }

  // Upsert: 동일 endpoint 있으면 업데이트
  const saved = await prisma.push_subscriptions.upsert({
    where: { endpoint },
    update: {
      updated_at: new Date(),
      is_active: true, // 재구독 시 다시 활성화
      failure_count: 0, // 카운터 초기화
    },
    create: {
      user_id: userId,
      endpoint,
      p256dh_key: keys.p256dh,
      auth_key: keys.auth,
      device_name: deviceName || null,
      user_agent: userAgent || null,
    },
  });

  return saved;
};
