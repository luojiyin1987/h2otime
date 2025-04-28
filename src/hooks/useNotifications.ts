import { useEffect, useState } from "react";

interface UseNotificationsProps {
  reminderEnabled: boolean;
  reminderInterval: number;
  notificationsSupported: boolean;
  onNotify?: () => void;
}

export function useNotifications({
  reminderEnabled,
  reminderInterval,
  notificationsSupported,
  onNotify,
}: UseNotificationsProps) {
  const [lastNotification, setLastNotification] = useState<Date | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (reminderEnabled) {
      intervalId = setInterval(
        () => {
          if (notificationsSupported && Notification.permission === "granted") {
            // 标准网页通知 - 适用于大多数浏览器
            new Notification("喝水提醒", {
              body: "该喝水了！保持水分很重要。",
              icon: "/water-icon.png",
            });
          } else {
            // 针对不支持 Notifications API 的浏览器(包括iOS)的替代方案
            setSnackbarOpen(true);
          }
          setLastNotification(new Date());
          onNotify && onNotify();
        },
        reminderInterval * 60 * 1000,
      );
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [reminderEnabled, reminderInterval, notificationsSupported, onNotify]);

  return { lastNotification, snackbarOpen, setSnackbarOpen };
}
