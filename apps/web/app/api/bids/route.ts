import { NextRequest, NextResponse } from 'next/server';

import { createNotification } from '@web/constants';
import { prisma } from '@web/lib/prisma';

import { createBid } from '@web/services/bids/server';
import { sendPushNotification } from '@web/services/notifications/server';
import { updateProductStatus } from '@web/services/products/server';

import { getUserIdCookie } from '@web/utils/auth/server';
import { calculateCurrentPrice } from '@web/utils/products';

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

    const product = await prisma.products.findUnique({
      where: {
        product_id: productId,
      },
    });

    if (!product) {
      return NextResponse.json({ error: '상품을 찾을 수 없습니다' }, { status: 404 });
    }

    if (product.status !== 'ACTIVE') {
      return NextResponse.json({ error: '경매가 진행 중인 상품이 아닙니다' }, { status: 400 });
    }

    if (product.seller_user_id === userId) {
      return NextResponse.json({ error: '자신의 상품에는 입찰할 수 없습니다' }, { status: 400 });
    }

    const calculatedCurrentPrice = calculateCurrentPrice(
      product.start_price.toNumber(),
      product.min_price.toNumber(),
      product.decrease_unit.toNumber(),
      product.auction_started_at.toISOString()
    );

    if (calculatedCurrentPrice.toFixed(2) !== bidPrice.toFixed(2)) {
      return NextResponse.json(
        { error: '입찰 가격이 현재 가격과 일치하지 않습니다' },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const newBid = await createBid(productId, userId!, bidPrice, tx);
      const updatedProduct = await updateProductStatus(productId, 'SOLD', tx);

      return { newBid, updatedProduct };
    });

    // 트랜잭션 완료 후, 비블로킹 방식으로 알림 발송
    const sellerId = result.updatedProduct.seller_user_id;

    if (sellerId !== userId) {
      // 비블로킹: 푸시 알림 실패해도 입찰 성공은 유지
      sendPushNotification({
        userId: sellerId,
        notification: createNotification('AUCTION_SOLD', {
          productId: String(productId),
          productName: product.title,
          finalPrice: bidPrice,
        }),
      }).catch((error) => {
        // 에러 로깅만 하고 실패해도 무시
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
    console.error('입찰 처리 오류:', error);

    if (error instanceof Error && error.message.includes('Prisma')) {
      return NextResponse.json({ error: '데이터베이스 오류가 발생했습니다' }, { status: 500 });
    }

    return NextResponse.json({ error: '입찰 처리 중 오류가 발생했습니다' }, { status: 500 });
  }
}
