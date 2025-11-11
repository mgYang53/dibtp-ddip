import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@web/lib/prisma';
import { upsertPushSubscription, deletePushSubscription } from '@web/services/notifications/server';
import type { PushSubscriptionData } from '@web/types';
import { getUserIdCookie } from '@web/utils/auth/server';

// 사용자의 푸시 구독 목록 조회
export const GET = async () => {
  try {
    // 1. 인증 확인
    const userId = await getUserIdCookie();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. 사용자의 구독 정보 조회
    const subscriptions = await prisma.push_subscriptions.findMany({
      where: { user_id: userId },
      select: {
        endpoint: true,
        device_name: true,
        created_at: true,
        updated_at: true,
        is_active: true,
      },
    });

    return NextResponse.json({
      subscribed: subscriptions.length > 0,
      subscriptions,
    });
  } catch (error) {
    console.error('Failed to get subscription status:', error);
    return NextResponse.json({ error: 'Failed to get status' }, { status: 500 });
  }
};

// 새로운 푸시 구독 생성
export const POST = async (request: NextRequest) => {
  try {
    // 1. 인증 확인
    const userId = await getUserIdCookie();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. 요청 바디 파싱
    const body = await request.json();
    const subscription = body.subscription as PushSubscriptionData;
    const deviceName = body.deviceName as string | undefined;

    if (!subscription?.endpoint || !subscription?.keys) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
    }

    // 3. User-Agent 추출
    const userAgent = request.headers.get('user-agent') || undefined;

    // 4. 구독 정보 저장
    const saved = await upsertPushSubscription({
      userId,
      subscription,
      deviceName,
      userAgent,
    });

    return NextResponse.json(
      {
        success: true,
        subscriptionId: saved.subscription_id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to save push subscription:', error);
    return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
  }
};

// 푸시 구독 삭제
export const DELETE = async (request: NextRequest) => {
  try {
    // 1. 인증 확인
    const userId = await getUserIdCookie();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. 요청 바디 파싱
    const body = await request.json();
    const { endpoint } = body;

    if (!endpoint) {
      return NextResponse.json({ error: 'Endpoint required' }, { status: 400 });
    }

    // 3. 🔒 소유권 검증 (보안 필수)
    const subscription = await prisma.push_subscriptions.findUnique({
      where: { endpoint },
    });

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    if (subscription.user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 4. 구독 삭제
    await deletePushSubscription(endpoint);

    return NextResponse.json({ success: true }, { status: 204 });
  } catch (error) {
    console.error('Failed to unsubscribe:', error);
    return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 });
  }
};
