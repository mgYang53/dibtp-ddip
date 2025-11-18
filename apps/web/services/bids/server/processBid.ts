import { prisma } from '@web/lib/prisma';
import type { TransactionClient } from '@web/types/lib';
import { calculateCurrentPrice } from '@web/utils/products';

import { updateProductStatus } from '../../products/server';

import { createBid } from './createBid';

interface ProcessBidParams {
  productId: bigint;
  userId: string;
  bidPrice: number;
}

/**
 * 입찰 처리 비즈니스 로직
 * - 상품 검증 (존재 여부, 상태, 소유권)
 * - 가격 검증
 * - 트랜잭션으로 입찰 생성 및 상품 상태 업데이트
 */
export const processBid = async ({ productId, userId, bidPrice }: ProcessBidParams) => {
  // 1. 상품 정보 조회
  const product = await prisma.products.findUnique({
    where: { product_id: productId },
  });

  if (!product) {
    throw new Error('상품을 찾을 수 없습니다');
  }

  // 2. 상품 상태 검증
  if (product.status !== 'ACTIVE') {
    throw new Error('경매가 진행 중인 상품이 아닙니다');
  }

  // 3. 자신의 상품인지 검증
  if (product.seller_user_id === userId) {
    throw new Error('자신의 상품에는 입찰할 수 없습니다');
  }

  // 4. 현재 가격 계산 및 검증
  const calculatedCurrentPrice = calculateCurrentPrice(
    product.start_price.toNumber(),
    product.min_price.toNumber(),
    product.decrease_unit.toNumber(),
    product.auction_started_at!.toISOString()
  );

  if (calculatedCurrentPrice.toFixed(2) !== bidPrice.toFixed(2)) {
    throw new Error('입찰 가격이 현재 가격과 일치하지 않습니다');
  }

  // 5. 트랜잭션: 입찰 생성 + 상품 상태 업데이트
  const result = await prisma.$transaction(async (tx: TransactionClient) => {
    const newBid = await createBid(productId, userId, bidPrice, tx);

    // 명시적으로 ACTIVE 상태인 경우에만 SOLD로 변경 (Optimistic Locking)
    // 동시 입찰 시 첫 번째만 성공하고 나머지는 "상품 상태가 ACTIVE가 아닙니다" 에러 발생
    const updatedProduct = await updateProductStatus(productId, 'SOLD', tx, 'ACTIVE');

    return { newBid, updatedProduct };
  });

  return result;
};
