import { NextResponse } from 'next/server';

import { prisma } from '@web/lib/prisma';
import { getUserIdCookie } from '@web/utils/auth/server';

export async function GET() {
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
}
