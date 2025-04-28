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
import { useTranslation } from "react-i18next";

function WaterReminder() {
  const { t } = useTranslation();
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(false);
  const [reminderInterval, setReminderInterval] = useState<number>(60); // minutes
  const [notificationsSupported, setNotificationsSupported] =
    useState<boolean>(true);
  const [showIosNotice, setShowIosNotice] = useState<boolean>(false);

  // Check if notifications API is available
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
        <Typography variant="h6">{t("reminder.title")}</Typography>
      </Box>

      {showIosNotice && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <InfoIcon sx={{ mr: 1 }} />
            <Typography>{t("reminder.iosNotice")}</Typography>
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
        label={t("reminder.enable")}
      />

      {reminderEnabled && (
        <Box sx={{ mt: 2 }}>
          <Typography gutterBottom>
            {t("reminder.interval", { interval: reminderInterval })}
          </Typography>
          <Slider
            value={reminderInterval}
            onChange={handleIntervalChange}
            min={30}
            max={180}
            step={30}
            marks={[
              { value: 30, label: t("reminder.intervals.30min") },
              { value: 60, label: t("reminder.intervals.1hour") },
              { value: 90, label: t("reminder.intervals.1.5hour") },
              { value: 120, label: t("reminder.intervals.2hour") },
              { value: 180, label: t("reminder.intervals.3hour") },
            ]}
          />
        </Box>
      )}

      {lastNotification && (
        <Alert severity="info" sx={{ mt: 2 }}>
          {t("reminder.lastReminder", {
            time: lastNotification.toLocaleTimeString(),
          })}
        </Alert>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={t("reminder.notification")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </Box>
  );
}

export default WaterReminder;
