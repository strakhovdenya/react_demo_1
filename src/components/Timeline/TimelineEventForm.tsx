import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ru } from "date-fns/locale";
import { TimelineBusyInterval } from "./Timeline.types";

interface TimelineEventFormProps {
  open: boolean;
  event: TimelineBusyInterval | null;
  onClose: () => void;
  onSave: (event: TimelineBusyInterval) => void;
  onDelete?: () => void;
  error?: string | null;
  loading?: boolean;
}

function toTimeString(date: Date | null) {
  if (!date) return "";
  return date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function fromTimeString(str: string): Date | null {
  if (!str) return null;
  const [h, m] = str.split(":");
  const d = new Date();
  d.setHours(Number(h), Number(m), 0, 0);
  return d;
}

const TimelineEventForm: React.FC<TimelineEventFormProps> = ({
  open,
  event,
  onClose,
  onSave,
  onDelete,
  error,
  loading,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [form, setForm] = useState<TimelineBusyInterval>({
    start: "",
    end: "",
    title: "",
    description: "",
  });

  useEffect(() => {
    if (event) setForm(event);
    else setForm({ start: "", end: "", title: "", description: "" });
  }, [event, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTimeChange = (field: "start" | "end", value: Date | null) => {
    setForm({ ...form, [field]: toTimeString(value) });
  };

  const handleSave = () => {
    if (form.start && form.end && form.title) {
      onSave(form);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: "center", pb: isMobile ? 1 : 2 }}>
          {event && event.id ? "Редактировать событие" : "Добавить событие"}
        </DialogTitle>
        <DialogContent sx={{ p: isMobile ? 1.5 : 2.5 }}>
          <Box
            sx={{
              display: "flex",
              gap: isMobile ? 1.5 : 2,
              mb: isMobile ? 1.5 : 2,
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <TimePicker
              label="Начало"
              value={fromTimeString(form.start)}
              onChange={(val: Date | null) => handleTimeChange("start", val)}
              ampm={false}
              minutesStep={15}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin={isMobile ? "dense" : "none"}
                />
              )}
            />
            <TimePicker
              label="Конец"
              value={fromTimeString(form.end)}
              onChange={(val: Date | null) => handleTimeChange("end", val)}
              ampm={false}
              minutesStep={15}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin={isMobile ? "dense" : "none"}
                />
              )}
            />
          </Box>
          <Box sx={{ mb: isMobile ? 1.5 : 2 }}>
            <TextField
              label="Название"
              name="title"
              value={form.title}
              onChange={handleChange}
              fullWidth
              required
              margin={isMobile ? "dense" : "none"}
            />
          </Box>
          <Box>
            <TextField
              label="Описание"
              name="description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              multiline
              minRows={2}
              margin={isMobile ? "dense" : "none"}
            />
          </Box>
          {error && (
            <Typography
              color="error"
              sx={{ mt: isMobile ? 1.5 : 2, textAlign: "center" }}
            >
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            p: isMobile ? "8px 12px" : "16px 24px",
            flexDirection: isMobile ? "column-reverse" : "row",
            alignItems: isMobile ? "stretch" : "center",
          }}
        >
          {event && event.id && (
            <Button
              onClick={onDelete}
              color="error"
              disabled={loading}
              fullWidth={isMobile}
              sx={{ mb: isMobile ? 1 : 0, mr: isMobile ? 0 : "auto" }}
            >
              Удалить
            </Button>
          )}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              width: isMobile ? "100%" : "auto",
              justifyContent: isMobile ? "space-between" : "flex-end",
            }}
          >
            <Button onClick={onClose} disabled={loading} fullWidth={isMobile}>
              Отмена
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={!form.start || !form.end || !form.title || loading}
              fullWidth={isMobile}
            >
              Сохранить
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default TimelineEventForm;
