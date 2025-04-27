import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Slider,
  Alert
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

function WaterReminder() {
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderInterval, setReminderInterval] = useState(60); // minutes
  const [lastNotification, setLastNotification] = useState(null);

  useEffect(() => {
    let intervalId;

    if (reminderEnabled) {
      intervalId = setInterval(() => {
        if (Notification.permission === 'granted') {
          new Notification('喝水提醒', {
            body: '该喝水了！保持水分很重要。',
            icon: '/water-icon.png'
          });
          setLastNotification(new Date());
        }
      }, reminderInterval * 60 * 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [reminderEnabled, reminderInterval]);

  const handleReminderToggle = () => {
    if (!reminderEnabled && Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setReminderEnabled(true);
        }
      });
    } else {
      setReminderEnabled(!reminderEnabled);
    }
  };

  const handleIntervalChange = (event, newValue) => {
    setReminderInterval(newValue);
    localStorage.setItem('reminderInterval', newValue);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <NotificationsActiveIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6">
          喝水提醒
        </Typography>
      </Box>

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
              { value: 30, label: '30分钟' },
              { value: 60, label: '1小时' },
              { value: 90, label: '1.5小时' },
              { value: 120, label: '2小时' },
              { value: 180, label: '3小时' }
            ]}
          />
        </Box>
      )}

      {lastNotification && (
        <Alert severity="info" sx={{ mt: 2 }}>
          上次提醒时间: {lastNotification.toLocaleTimeString()}
        </Alert>
      )}
    </Box>
  );
}

export default WaterReminder; 