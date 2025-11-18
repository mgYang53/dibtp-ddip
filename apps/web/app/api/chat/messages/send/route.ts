import { NextRequest, NextResponse } from 'next/server';

import { createNotification } from '@web/constants';
import { prisma } from '@web/lib/prisma';
import { sendMessage } from '@web/services/chat/server/sendMessage';
import { sendPushNotification } from '@web/services/notifications/server';

import type { SendMessageAPIRequest } from '@web/types';

/**
 * 메시지 전송 API 엔드포인트
 */
export async function POST(request: NextRequest) {
  try {
    // 요청 바디 파싱
    const payload: SendMessageAPIRequest = await request.json();

    // 입력 검증
    if (!payload.chat_room_id || !payload.message || !payload.sender_user_id) {
      return NextResponse.json(
        {
          data: null,
          error: {
            message: '채팅방 ID, 메시지 내용, 발신자 ID는 필수입니다.',
            code: 'MISSING_REQUIRED_PARAMS',
          },
        },
        { status: 400 }
      );
    }

    // 메시지 길이 검증
    if (payload.message.length > 1000) {
      return NextResponse.json(
        {
          data: null,
          error: {
            message: '메시지는 1000자를 초과할 수 없습니다.',
            code: 'MESSAGE_TOO_LONG',
          },
        },
        { status: 400 }
      );
    }

    // 서버 함수 호출
    const result = await sendMessage(payload);

    // 에러 처리
    if (result.error) {
      return NextResponse.json(result, {
        status:
          result.error.code === 'MISSING_REQUIRED_PARAMS' ||
          result.error.code === 'MESSAGE_TOO_LONG'
            ? 400
            : 500,
      });
    }

    // 메시지 전송 완료 후, 비블로킹 방식으로 알림 발송
    if (result.data?.chatRoom) {
      const buyerUserId = result.data.chatRoom.buyer_user_id;
      const sellerUserId = result.data.chatRoom.seller_user_id;
      const recipientId = payload.sender_user_id === buyerUserId ? sellerUserId : buyerUserId;

      // 발신자 닉네임 조회
      const sender = await prisma.users.findUnique({
        where: { user_id: payload.sender_user_id },
        select: { nickname: true },
      });

      // 비블로킹: 푸시 알림 실패해도 메시지 전송 성공은 유지
      sendPushNotification({
        userId: recipientId,
        notification: createNotification('NEW_MESSAGE', {
          chatRoomId: payload.chat_room_id,
          senderName: sender?.nickname || '상대방',
          messagePreview:
            payload.message.length > 50
              ? `${payload.message.substring(0, 50)}...`
              : payload.message,
        }),
      }).catch((error) => {
        // 에러 로깅만 하고 실패해도 무시
        // eslint-disable-next-line no-console
        console.error('[Push Notification] Failed to send chat notification:', error);
      });
    }

    // 성공 응답 (chatRoom 정보는 클라이언트에 노출하지 않음)
    return NextResponse.json(
      {
        data: {
          message: result.data.message,
        },
        error: null,
      },
      { status: 201 }
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('메시지 전송 API 오류:', error);
    }

    return NextResponse.json(
      {
        data: null,
        error: {
          message: '서버 내부 오류가 발생했습니다.',
          code: 'INTERNAL_SERVER_ERROR',
        },
      },
      { status: 500 }
    );
  }
}
