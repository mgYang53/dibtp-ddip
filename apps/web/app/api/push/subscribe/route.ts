import { NextRequest, NextResponse } from 'next/server';

import { saveSubscription } from '@web/services/notifications/server';
import type { PushSubscriptionData } from '@web/types';
import { getUserIdCookie } from '@web/utils/auth/server';

export async function POST(request: NextRequest) {
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
    const saved = await saveSubscription({
      userId,
      subscription,
      deviceName,
      userAgent,
    });

    return NextResponse.json({
      success: true,
      subscriptionId: saved.subscription_id,
    });
  } catch (error) {
    console.error('Failed to save push subscription:', error);
    return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
  }
}
