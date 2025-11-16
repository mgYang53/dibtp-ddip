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
    const whereCondition: { product_id: bigint; status?: ProductStatus } = {
      product_id: productId,
    };

    if (expectedCurrentStatus) {
      whereCondition.status = expectedCurrentStatus;
    }

    const updatedProduct = await db.products.update({
      where: whereCondition,
      data: {
        status,
        updated_at: new Date(),
        ...(status === PRODUCT_STATUS.ACTIVE && { auction_started_at: new Date().toISOString() }),
      },
    });

    return updatedProduct;
  } catch (error) {
    console.error('상품 상태 업데이트 오류:', error);

    // Prisma P2025: 레코드를 찾을 수 없음 (상태 조건 불일치)
    if (error instanceof Error && error.message.includes('P2025')) {
      throw new Error(
        expectedCurrentStatus
          ? `상품 상태가 ${expectedCurrentStatus}가 아니어서 업데이트할 수 없습니다`
          : '상품을 찾을 수 없습니다'
      );
    }

    // 기타 Prisma 오류
    if (error instanceof Error && error.message.includes('Prisma')) {
      throw new Error('데이터베이스 오류가 발생했습니다');
    }

    throw new Error('상품 상태 업데이트 중 오류가 발생했습니다');
  }
};
