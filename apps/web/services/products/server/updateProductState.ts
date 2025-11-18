import { PRODUCT_STATUS } from '@web/constants';
import { prisma } from '@web/lib/prisma';

import type { ProductStatus } from '@web/types';
import type { TransactionClient } from '@web/types/lib';

/**
 * 상품 상태를 업데이트하는 서비스 함수
 * @param productId - 상태를 변경할 상품의 ID
 * @param status - 새로운 상품 상태
 * @param tx - Prisma 트랜잭션 클라이언트 (옵션)
 * @param expectedCurrentStatus - 현재 상태가 이 값일 때만 업데이트 (Optimistic Locking)
 */
export const updateProductStatus = async (
  productId: bigint,
  status: ProductStatus,
  tx?: TransactionClient,
  expectedCurrentStatus?: ProductStatus
) => {
  const db = tx || prisma;
  try {
    // WHERE 조건: 명시적 상태 체크 (Optimistic Locking)
    const whereCondition = {
      product_id: productId,
      ...(expectedCurrentStatus && { status: expectedCurrentStatus }),
    };

    const updateResult = await db.products.updateMany({
      where: whereCondition,
      data: {
        status,
        updated_at: new Date(),
        ...(status === PRODUCT_STATUS.ACTIVE && { auction_started_at: new Date().toISOString() }),
      },
    });

    // 업데이트된 행이 없으면 에러 (상태 불일치 또는 레코드 없음)
    if (updateResult.count === 0) {
      throw new Error(
        expectedCurrentStatus
          ? `상품 상태가 ${expectedCurrentStatus}가 아니어서 업데이트할 수 없습니다`
          : '상품을 찾을 수 없습니다'
      );
    }

    const updatedProduct = await db.products.findUniqueOrThrow({
      where: { product_id: productId },
    });

    return updatedProduct;
  } catch (error) {
    console.error('상품 상태 업데이트 오류:', error);

    // 이미 던진 명시적 에러는 그대로 전달
    if (
      error instanceof Error &&
      (error.message.includes('상품 상태가') || error.message === '상품을 찾을 수 없습니다')
    ) {
      throw error;
    }

    // P2025: findUniqueOrThrow 실패
    if (error instanceof Error && error.message.includes('P2025')) {
      throw new Error('상품을 찾을 수 없습니다');
    }

    // 기타 Prisma 오류
    if (error instanceof Error && error.message.includes('Prisma')) {
      throw new Error('데이터베이스 오류가 발생했습니다');
    }

    throw new Error('상품 상태 업데이트 중 오류가 발생했습니다');
  }
};
