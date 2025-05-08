import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Box, Typography } from '@mui/material';
import { TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import { TimelineBusyInterval } from './Timeline.types';
import TimelineEventActions from './TimelineEventActions';

/**
 * @description Форма для добавления и редактирования событий в Timeline111
 */
interface DesktopTimelineEventFormProps {
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
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function fromTimeString(str: string): Date | null {
  if (!str) return null;
  const [h, m] = str.split(':');
  const d = new Date();
  d.setHours(Number(h), Number(m), 0, 0);
  return d;
}

const DesktopTimelineEventForm: React.FC<DesktopTimelineEventFormProps> = ({
  open,
  event,
  onClose,
  onSave,
  onDelete,
  error,
  loading,
}) => {
  const [form, setForm] = useState<TimelineBusyInterval>({
    start: '',
    end: '',
    title: '',
    description: '',
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
        <DialogTitle sx={{ textAlign: 'center', pb: 2 }}>
          {event && event.id ? 'Редактировать событие' : 'Добавить событие'}
        </DialogTitle>
        <DialogContent sx={{ p: 2.5 }}>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mb: 2,
            }}
          >
            <TimePicker
              label="Начало"
              value={fromTimeString(form.start)}
              onChange={(val: Date | null) => handleTimeChange('start', val)}
              ampm={false}
              minutesStep={15}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                    sx: { color: '#222', fontSize: 15, fontWeight: 500 },
                  }}
                  margin="normal"
                />
              )}
            />
            <TimePicker
              label="Конец"
              value={fromTimeString(form.end)}
              onChange={(val: Date | null) => handleTimeChange('end', val)}
              ampm={false}
              minutesStep={15}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                    sx: { color: '#222', fontSize: 15, fontWeight: 500 },
                  }}
                  margin="normal"
                />
              )}
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
            <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <TimelineEventActions
          isEdit={!!event && !!event.id}
          loading={loading}
          onDelete={onDelete}
          onClose={onClose}
          onSave={handleSave}
          isSaveDisabled={!form.start || !form.end || !form.title}
        />
      </Dialog>
    </LocalizationProvider>
  );
};

export default DesktopTimelineEventForm;
