import type { ApiResponse } from '@web/types/common';

import type {
  ChatRoom,
  ChatMessage,
  ChatRoomWithDetails,
  ChatMessageWithSender,
  ChatListFilter,
  MessagePaginationOptions,
} from './domain';

// === API 요청 타입들 ===

// 채팅방 목록 조회 요청
export interface GetChatRoomsAPIRequest {
  user_id: string;
  filter?: ChatListFilter;
  limit?: number;
  offset?: number;
}

// 채팅방 상세 조회 요청
export interface GetChatRoomDetailAPIRequest {
  chat_room_id: string;
  user_id: string;
}

// 메시지 목록 조회 요청
export interface GetMessagesAPIRequest {
  chat_room_id: string;
  user_id: string;
  pagination?: MessagePaginationOptions;
}

// 채팅방 생성 요청
export interface CreateChatRoomAPIRequest {
  product_id: number;
  buyer_user_id: string;
  seller_user_id: string;
}

// 메시지 전송 요청
export interface SendMessageAPIRequest {
  chat_room_id: string;
  message: string;
  sender_user_id: string;
}

// 메시지 읽음 처리 요청
export interface MarkMessagesAsReadAPIRequest {
  chat_room_id: string;
  user_id: string;
  message_ids?: number[]; // 특정 메시지들만 읽음 처리 (없으면 전체)
}

// === API 응답 타입들 ===

// 채팅방 목록 조회 응답
export type GetChatRoomsAPIResponse = ApiResponse<{
  chatRooms: ChatRoomWithDetails[];
  totalCount: number;
  hasMore: boolean;
}>;

// 채팅방 상세 조회 응답
export type GetChatRoomDetailAPIResponse = ApiResponse<{
  chatRoom: ChatRoomWithDetails;
}>;

// 메시지 목록 조회 응답
export type GetMessagesAPIResponse = ApiResponse<{
  messages: ChatMessageWithSender[];
  hasMore: boolean;
  nextCursor?: string;
  prevCursor?: string;
}>;

// 채팅방 생성 응답
export type CreateChatRoomAPIResponse = ApiResponse<{
  chatRoom: ChatRoom;
  isExisting: boolean; // 기존 채팅방인지 새로 생성된 채팅방인지
}>;

// 메시지 전송 응답
export type SendMessageAPIResponse = ApiResponse<{
  message: ChatMessage;
  chatRoom?: {
    buyer_user_id: string;
    seller_user_id: string;
  };
}>;

// 메시지 읽음 처리 응답
export type MarkMessagesAsReadAPIResponse = ApiResponse<{
  updatedCount: number;
}>;

// Supabase Realtime 채널 타입들
export interface ChatRealtimeChannel {
  channelName: string;
  subscribe: () => void;
  unsubscribe: () => void;
}

export interface RealtimeSubscriptionConfig {
  table: 'chat_messages' | 'chat_rooms';
  filter?: string;
  event?: '*' | 'INSERT' | 'UPDATE' | 'DELETE';
}
