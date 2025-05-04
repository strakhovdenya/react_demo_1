import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography } from '@mui/material';
import { TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import { TimelineBusyInterval } from './Timeline.types';

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
  if (!date) return '';
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function fromTimeString(str: string): Date | null {
  if (!str) return null;
  const [h, m] = str.split(':');
  const d = new Date();
  d.setHours(Number(h), Number(m), 0, 0);
  return d;
}

const TimelineEventForm: React.FC<TimelineEventFormProps> = ({ open, event, onClose, onSave, onDelete, error, loading }) => {
  const [form, setForm] = useState<TimelineBusyInterval>({
    start: '',
    end: '',
    title: '',
    description: ''
  });

  useEffect(() => {
    if (event) setForm(event);
    else setForm({ start: '', end: '', title: '', description: '' });
  }, [event, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTimeChange = (field: 'start' | 'end', value: Date | null) => {
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
        <DialogTitle>{event && event.id ? 'Редактировать событие' : 'Добавить событие'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TimePicker
              label="Начало"
              value={fromTimeString(form.start)}
              onChange={val => handleTimeChange('start', val)}
              ampm={false}
              minutesStep={15}
              format="HH:mm"
              slotProps={{ textField: { fullWidth: true } }}
            />
            <TimePicker
              label="Конец"
              value={fromTimeString(form.end)}
              onChange={val => handleTimeChange('end', val)}
              ampm={false}
              minutesStep={15}
              format="HH:mm"
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Название"
              name="title"
              value={form.title}
              onChange={handleChange}
              fullWidth
              required
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
            />
          </Box>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          {event && event.id && (
            <Button onClick={onDelete} color="error" disabled={loading}>
              Удалить
            </Button>
          )}
          <Button onClick={onClose} disabled={loading}>Отмена</Button>
          <Button onClick={handleSave} variant="contained" disabled={!form.start || !form.end || !form.title || loading}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default TimelineEventForm; 