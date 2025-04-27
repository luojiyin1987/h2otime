import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Typography,
  Box,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';

interface WaterIntake {
  id: string;
  amount: string;
  timestamp: string;
}

interface WaterIntakeListProps {
  intakes: WaterIntake[];
  onDelete: (id: string) => void;
  dailyGoal: number;
}

const WaterIntakeList: React.FC<WaterIntakeListProps> = ({ 
  intakes, 
  onDelete,
  dailyGoal 
}) => {
  const { t } = useTranslation();
  
  const totalIntake = intakes.reduce((sum, intake) => sum + parseInt(intake.amount), 0);
  const progress = (totalIntake / dailyGoal) * 100;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t('list.title')}
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1">
          {t('list.total')}: {totalIntake}ml / {dailyGoal}ml
        </Typography>
        <Box sx={{ 
          width: '100%', 
          height: 20, 
          bgcolor: 'grey.200',
          borderRadius: 1,
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            width: `${Math.min(progress, 100)}%`, 
            height: '100%', 
            bgcolor: 'primary.main',
            transition: 'width 0.3s ease-in-out'
          }} />
        </Box>
      </Box>

      <List>
        {intakes.map((intake) => (
          <ListItem
            key={intake.id}
            secondaryAction={
              <IconButton 
                edge="end" 
                aria-label="delete"
                onClick={() => onDelete(intake.id)}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={`${intake.amount}ml`}
              secondary={new Date(intake.timestamp).toLocaleString()}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default WaterIntakeList; 