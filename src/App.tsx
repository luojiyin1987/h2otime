import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  ThemeProvider,
  createTheme
} from '@mui/material';
import WaterIntakeForm from './components/WaterIntakeForm';
import WaterProgress from './components/WaterProgress';
import WaterHistory from './components/WaterHistory';
import WaterReminder from './components/WaterReminder';

interface WaterRecord {
  date: string;
  amount: number;
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#4caf50',
    },
  },
});

function App() {
  const [dailyGoal, setDailyGoal] = useState<number>(2000); // Default 2000ml
  const [todayIntake, setTodayIntake] = useState<number>(0);
  const [history, setHistory] = useState<WaterRecord[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const savedGoal = localStorage.getItem('dailyGoal');
    const savedHistory = localStorage.getItem('waterHistory');
    
    if (savedGoal) setDailyGoal(parseInt(savedGoal));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    
    // Calculate today's intake
    const today = new Date().toDateString();
    const todayRecords = JSON.parse(savedHistory || '[]')
      .filter((record: WaterRecord) => new Date(record.date).toDateString() === today);
    const todayTotal = todayRecords.reduce((sum: number, record: WaterRecord) => sum + record.amount, 0);
    setTodayIntake(todayTotal);
  }, []);

  const handleIntakeSubmit = (amount: string) => {
    const newRecord: WaterRecord = {
      date: new Date().toISOString(),
      amount: parseInt(amount)
    };
    
    const newHistory = [...history, newRecord];
    setHistory(newHistory);
    setTodayIntake(prev => prev + parseInt(amount));
    localStorage.setItem('waterHistory', JSON.stringify(newHistory));
  };

  const calculateProgress = (): number => {
    return Math.min((todayIntake / dailyGoal) * 100, 100);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
            H2O Time
          </Typography>
          <Typography variant="h6" component="h2" gutterBottom align="center" color="text.secondary">
            保持水分，保持健康
          </Typography>
          
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <WaterIntakeForm 
              onSubmit={handleIntakeSubmit}
              dailyGoal={dailyGoal}
              setDailyGoal={setDailyGoal}
            />
          </Paper>

          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <WaterProgress 
              current={todayIntake}
              goal={dailyGoal}
              progress={calculateProgress()}
            />
          </Paper>

          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <WaterReminder />
          </Paper>

          <Paper elevation={3} sx={{ p: 3 }}>
            <WaterHistory history={history} />
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App; 