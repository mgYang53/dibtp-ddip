import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@web/lib/prisma';
import { deleteSubscription } from '@web/services/notifications/server';
import { getUserIdCookie } from '@web/utils/auth/server';

export async function DELETE(request: NextRequest) {
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
    await deleteSubscription(endpoint);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to unsubscribe:', error);
    return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 });
  }
}
