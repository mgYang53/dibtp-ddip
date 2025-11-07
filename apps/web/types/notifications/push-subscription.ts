export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface SaveSubscriptionParams {
  userId: string;
  subscription: PushSubscriptionData;
  deviceName?: string;
  userAgent?: string;
}

export interface PushSubscriptionRecord {
  subscription_id: string;
  user_id: string;
  endpoint: string;
  p256dh_key: string;
  auth_key: string;
  device_name: string | null;
  user_agent: string | null;
  is_active: boolean;
  failure_count: number;
  last_success_at: Date | null;
  last_failure_at: Date | null;
  created_at: Date;
  updated_at: Date | null;
}
