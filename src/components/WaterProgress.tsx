import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  CircularProgress
} from '@mui/material';

interface WaterProgressProps {
  current: number;
  goal: number;
  progress: number;
}

function WaterProgress({ current, goal, progress }: WaterProgressProps) {
  const getProgressColor = (progress: number): 'error' | 'warning' | 'success' => {
    if (progress < 30) return 'error';
    if (progress < 70) return 'warning';
    return 'success';
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        今日进度
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
          <CircularProgress
            variant="determinate"
            value={progress}
            size={80}
            color={getProgressColor(progress)}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="caption" component="div" color="text.secondary">
              {`${Math.round(progress)}%`}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body1">
            已饮用: {current}ml / {goal}ml
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            color={getProgressColor(progress)}
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>
      </Box>
      
      {progress < 30 && (
        <Typography color="error" variant="body2">
          今天喝水有点少哦，记得多喝水！
        </Typography>
      )}
      {progress >= 30 && progress < 70 && (
        <Typography color="warning.main" variant="body2">
          继续加油，保持水分！
        </Typography>
      )}
      {progress >= 70 && (
        <Typography color="success.main" variant="body2">
          做得好！继续保持！
        </Typography>
      )}
    </Box>
  );
}

export default WaterProgress; 