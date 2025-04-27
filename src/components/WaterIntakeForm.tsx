import React, { useState, FormEvent } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Slider,
  Grid,
  InputAdornment
} from '@mui/material';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';

interface WaterIntakeFormProps {
  onSubmit: (amount: string) => void;
  dailyGoal: number;
  setDailyGoal: (goal: number) => void;
}

function WaterIntakeForm({ onSubmit, dailyGoal, setDailyGoal }: WaterIntakeFormProps) {
  const [amount, setAmount] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (amount && parseInt(amount) > 0) {
      onSubmit(amount);
      setAmount('');
    }
  };

  const handleGoalChange = (_event: Event, newValue: number | number[]) => {
    setDailyGoal(newValue as number);
    localStorage.setItem('dailyGoal', (newValue as number).toString());
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        记录饮水
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="饮水量"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">ml</InputAdornment>,
            }}
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            startIcon={<LocalDrinkIcon />}
            sx={{ height: '56px' }}
          >
            记录
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Typography gutterBottom>
            每日目标: {dailyGoal}ml
          </Typography>
          <Slider
            value={dailyGoal}
            onChange={handleGoalChange}
            min={1000}
            max={4000}
            step={100}
            marks={[
              { value: 1000, label: '1L' },
              { value: 2000, label: '2L' },
              { value: 3000, label: '3L' },
              { value: 4000, label: '4L' }
            ]}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default WaterIntakeForm; 