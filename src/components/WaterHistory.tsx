import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Button,
} from "@mui/material";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import { useTranslation } from "react-i18next";

interface WaterRecord {
  date: string;
  amount: number;
}

interface WaterHistoryProps {
  history: WaterRecord[];
}

function WaterHistory({ history }: WaterHistoryProps) {
  const { t, i18n } = useTranslation();

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(i18n.language === "zh" ? "zh-CN" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const groupByDate = (
    records: WaterRecord[],
  ): Record<string, WaterRecord[]> => {
    const groups: Record<string, WaterRecord[]> = {};
    records.forEach((record) => {
      const date = new Date(record.date).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(record);
    });
    return groups;
  };

  const handleDeleteAll = () => {
    if (window.confirm(t("history.confirmDelete"))) {
      localStorage.removeItem("waterHistory");
      window.location.reload();
    }
  };

  const groupedHistory = groupByDate(history);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          borderBottom: "1px solid",
          borderColor: "divider",
          pb: 2,
        }}
      >
        <Typography variant="h6" component="h3">
          {t("history.title")}
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteAll}
          sx={{
            minWidth: "120px",
            "&:hover": {
              backgroundColor: "error.dark",
            },
          }}
        >
          {t("history.deleteAll")}
        </Button>
      </Box>

      {Object.entries(groupedHistory).map(([date, records]) => (
        <Box key={date} sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            {new Date(date).toLocaleDateString(
              i18n.language === "zh" ? "zh-CN" : "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              },
            )}
          </Typography>

          <List>
            {records.map((record, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <LocalDrinkIcon sx={{ mr: 1, color: "primary.main" }} />
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
          {t("history.noRecords")}
        </Typography>
      )}
    </Box>
  );
}

export default WaterHistory;
