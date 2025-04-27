import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Button
} from '@mui/material';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';

interface WaterRecord {
  date: string;
  amount: number;
}

interface WaterHistoryProps {
  history: WaterRecord[];
}

function WaterHistory({ history }: WaterHistoryProps) {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const groupByDate = (records: WaterRecord[]): Record<string, WaterRecord[]> => {
    const groups: Record<string, WaterRecord[]> = {};
    records.forEach(record => {
      const date = new Date(record.date).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(record);
    });
    return groups;
  };

  const handleDeleteAll = () => {
    if (window.confirm('确定要删除所有饮水记录吗？')) {
      localStorage.removeItem('waterHistory');
      window.location.reload();
    }
  };

  const groupedHistory = groupByDate(history);

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        borderBottom: '1px solid',
        borderColor: 'divider',
        pb: 2
      }}>
        <Typography variant="h6" component="h3">饮水记录</Typography>
        <Button 
          variant="contained" 
          color="error"
          onClick={handleDeleteAll}
          sx={{ 
            minWidth: '120px',
            '&:hover': {
              backgroundColor: 'error.dark'
            }
          }}
        >
          删除所有记录
        </Button>
      </Box>
      
      {Object.entries(groupedHistory).map(([date, records]) => (
        <Box key={date} sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            {new Date(date).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Typography>
          
          <List>
            {records.map((record, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocalDrinkIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body1">
                          {formatDate(record.date)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Chip
                        label={`${record.amount}ml`}
                        color="primary"
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    }
                  />
                </ListItem>
                {index < records.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      ))}
      
      {history.length === 0 && (
        <Typography color="text.secondary" align="center">
          还没有记录，开始记录你的饮水吧！
        </Typography>
      )}
    </Box>
  );
}

export default WaterHistory; 