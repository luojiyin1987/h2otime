import React, { useState, FormEvent } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Slider,
  Grid,
  InputAdornment,
} from "@mui/material";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import { useTranslation } from "react-i18next";

interface WaterIntakeFormProps {
  onSubmit: (amount: string) => void;
  dailyGoal: number;
  setDailyGoal: (goal: number) => void;
}

function WaterIntakeForm({
  onSubmit,
  dailyGoal,
  setDailyGoal,
}: WaterIntakeFormProps) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (amount && parseInt(amount) > 0) {
      onSubmit(amount);
      setAmount("");
    }
  };

  const handleGoalChange = (_event: Event, newValue: number | number[]) => {
    setDailyGoal(newValue as number);
    localStorage.setItem("dailyGoal", (newValue as number).toString());
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        {t("form.recordIntake")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={t("form.waterAmount")}
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
            sx={{ height: "56px" }}
          >
            {t("form.submit")}
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Typography gutterBottom>{t("form.dailyGoal")}</Typography>
          <Slider
            value={dailyGoal}
            onChange={handleGoalChange}
            min={500}
            max={5000}
            step={100}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value}ml`}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default WaterIntakeForm;
