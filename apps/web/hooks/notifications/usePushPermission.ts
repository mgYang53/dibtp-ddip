'use client';

import { useState, useEffect } from 'react';

import type { NotificationPermissionStatus } from '@web/types';
import {
  getNotificationPermission,
  requestNotificationPermission,
  isNotificationSupported,
} from '@web/utils/notifications';

export const usePushPermission = () => {
  const [permission, setPermission] = useState<NotificationPermissionStatus>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(isNotificationSupported());
    if (isNotificationSupported()) {
      setPermission(getNotificationPermission());
    }
  }, []);

  const requestPermission = async () => {
    const newPermission = await requestNotificationPermission();
    setPermission(newPermission);
    return newPermission;
  };

  return {
    permission,
    isSupported,
    requestPermission,
    isGranted: permission === 'granted',
    isDenied: permission === 'denied',
    isDefault: permission === 'default',
  };
};
