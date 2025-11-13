import { NextRequest, NextResponse } from 'next/server';

import { createNotification } from '@web/constants';

import { processBid } from '@web/services/bids/server';
import { sendPushNotification } from '@web/services/notifications/server';

import { getUserIdCookie } from '@web/utils/auth/server';

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdCookie();
    if (!userId) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
    }

    const { productId, bidPrice } = await request.json();

    if (!productId || !bidPrice) {
      return NextResponse.json(
        { error: '상품 ID 또는 현재 상품 가격 정보가 누락되었습니다' },
        { status: 400 }
      );
    }

    const result = await processBid({
      productId,
      userId: userId!,
      bidPrice,
    });

    // 트랜잭션 완료 후, 비블로킹 방식으로 알림 발송
    const sellerId = result.updatedProduct.seller_user_id;

    if (sellerId !== userId) {
      // 비블로킹: 푸시 알림 실패해도 입찰 성공은 유지
      sendPushNotification({
        userId: sellerId,
        notification: createNotification('AUCTION_SOLD', {
          productId: String(productId),
          productName: result.updatedProduct.title,
          finalPrice: bidPrice,
        }),
      }).catch((error) => {
        // 에러 로깅만 하고 실패해도 무시
        // eslint-disable-next-line no-console
        console.error('[Push Notification] Failed to send bid notification:', error);
      });
    }

    const jsonResponse = JSON.stringify(
      {
        message: '입찰이 성공적으로 완료되었습니다',
        bid: result.newBid,
        product: result.updatedProduct,
      },
      (key, value) => (typeof value === 'bigint' ? value.toString() : value)
    );

    return new NextResponse(jsonResponse, {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('입찰 처리 오류:', error);

    // 비즈니스 로직 검증 오류 (400)
    if (error instanceof Error) {
      if (
        error.message === '상품을 찾을 수 없습니다' ||
        error.message === '경매가 진행 중인 상품이 아닙니다' ||
        error.message === '자신의 상품에는 입찰할 수 없습니다' ||
        error.message === '입찰 가격이 현재 가격과 일치하지 않습니다'
      ) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      // 데이터베이스 오류 (500)
      if (error.message.includes('Prisma')) {
        return NextResponse.json({ error: '데이터베이스 오류가 발생했습니다' }, { status: 500 });
      }
    }

    return NextResponse.json({ error: '입찰 처리 중 오류가 발생했습니다' }, { status: 500 });
  }
}
