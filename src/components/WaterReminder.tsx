import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Slider,
  Alert,
  Snackbar,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import InfoIcon from "@mui/icons-material/Info";
import { useNotifications } from "../hooks/useNotifications";

function WaterReminder() {
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(false);
  const [reminderInterval, setReminderInterval] = useState<number>(60); // minutes
  const [notificationsSupported, setNotificationsSupported] =
    useState<boolean>(true);
  const [showIosNotice, setShowIosNotice] = useState<boolean>(false);

  // 检查通知 API 是否可用
  useEffect(() => {
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const notificationsAvailable = "Notification" in window;

    setNotificationsSupported(notificationsAvailable && !isIOS);
    setShowIosNotice(isIOS);
  }, []);

  const { lastNotification, snackbarOpen, setSnackbarOpen } = useNotifications({
    reminderEnabled,
    reminderInterval,
    notificationsSupported,
  });

  const handleReminderToggle = () => {
    if (!reminderEnabled) {
      if (notificationsSupported && Notification.permission !== "granted") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            setReminderEnabled(true);
          }
        });
      } else {
        // 对于不支持通知的浏览器，无需请求权限
        setReminderEnabled(true);
      }
    } else {
      setReminderEnabled(false);
    }
  };

  const handleIntervalChange = (_event: Event, newValue: number | number[]) => {
    setReminderInterval(newValue as number);
    localStorage.setItem("reminderInterval", (newValue as number).toString());
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <NotificationsActiveIcon sx={{ mr: 1, color: "primary.main" }} />
        <Typography variant="h6">喝水提醒</Typography>
      </Box>

      {showIosNotice && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <InfoIcon sx={{ mr: 1 }} />
            <Typography>
              检测到iOS设备。由于iOS不支持网页通知，将使用应用内提醒替代。
            </Typography>
          </Box>
        </Alert>
      )}

      <FormControlLabel
        control={
          <Switch
            checked={reminderEnabled}
            onChange={handleReminderToggle}
            color="primary"
          />
        }
        label="启用提醒"
      />

      {reminderEnabled && (
        <Box sx={{ mt: 2 }}>
          <Typography gutterBottom>
            提醒间隔: {reminderInterval} 分钟
          </Typography>
          <Slider
            value={reminderInterval}
            onChange={handleIntervalChange}
            min={30}
            max={180}
            step={30}
            marks={[
              { value: 30, label: "30分钟" },
              { value: 60, label: "1小时" },
              { value: 90, label: "1.5小时" },
              { value: 120, label: "2小时" },
              { value: 180, label: "3小时" },
            ]}
          />
        </Box>
      )}

      {lastNotification && (
        <Alert severity="info" sx={{ mt: 2 }}>
          上次提醒时间: {lastNotification.toLocaleTimeString()}
        </Alert>
      )}

      {/* 适用于iOS设备的应用内提醒 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="该喝水了！保持水分很重要。"
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </Box>
  );
}

export default WaterReminder;
