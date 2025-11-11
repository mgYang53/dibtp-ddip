import { NextRequest, NextResponse } from 'next/server';

import { sendPushNotification } from '@web/services/notifications/server';
import { getUserIdCookie } from '@web/utils/auth/server';

export async function POST(request: NextRequest) {
  // 개발 환경에서만 동작
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const userId = await getUserIdCookie();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type = 'NEW_MESSAGE' } = await request.json();

    await sendPushNotification({
      userId,
      notification: {
        title: `테스트 알림 (${type})`,
        body: '푸시 알림 테스트입니다. 정상적으로 수신되었습니다!',
        icon: '/images/android-chrome-192x192.png',
        data: {
          type,
          url: '/',
          productId: '1',
        },
      },
    });

    return NextResponse.json({ success: true, message: 'Test notification sent' });
  } catch (error) {
    console.error('Failed to send test notification:', error);
    return NextResponse.json({ error: 'Failed to send test notification' }, { status: 500 });
  }
}
