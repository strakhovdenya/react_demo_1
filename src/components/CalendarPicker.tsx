import React from "react";
import { StaticDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ru } from "date-fns/locale";
import { TextField, Paper, Box } from "@mui/material";
import { format } from "date-fns";
import { styled } from "@mui/material/styles";

interface CalendarPickerProps {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  eventDates: { [key: string]: boolean };
}

const CustomPickerPaper = styled(Paper)(({ theme }) => ({
  background: "#fff",
  boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
  borderRadius: 16,
  padding: 12,
  minWidth: 0,
  width: 320,
  margin: "0 auto",
}));

const CalendarPicker: React.FC<CalendarPickerProps> = ({
  selectedDate,
  onChange,
  eventDates,
}) => (
  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        minWidth: 0,
        width: "100%",
        maxWidth: 340,
        margin: "32px 0 0 0",
      }}
    >
      <StaticDatePicker
        value={selectedDate}
        onChange={onChange}
        renderInput={(params: any) => <TextField {...params} />}
        shouldDisableDate={(date: Date) => {
          const dateStr = format(date, "yyyy-MM-dd");
          return !eventDates[dateStr];
        }}
        components={{
          PaperContent: CustomPickerPaper,
        }}
      />
    </Box>
  </LocalizationProvider>
);

export default CalendarPicker;
