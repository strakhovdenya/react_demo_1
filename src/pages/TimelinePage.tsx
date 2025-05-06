import React, { useState, useEffect } from "react";
import Timeline from "../components/Timeline";
import TimelineEventForm from "../components/Timeline/TimelineEventForm";
import { TimelineBusyInterval } from "../components/Timeline/Timeline.types";
import { Box, Button, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ru } from "date-fns/locale";
import { format, startOfDay, endOfDay } from "date-fns";
import { supabase } from "../supabaseClient";

interface ScheduleEvent {
  id: number;
  start: string;
  end: string;
  title: string;
  description: string;
}

function intervalsOverlap(a: TimelineBusyInterval, b: TimelineBusyInterval) {
  const aStart =
    parseInt(a.start.split(":")[0]) * 60 + parseInt(a.start.split(":")[1]);
  const aEnd =
    parseInt(a.end.split(":")[0]) * 60 + parseInt(a.end.split(":")[1]);
  const bStart =
    parseInt(b.start.split(":")[0]) * 60 + parseInt(b.start.split(":")[1]);
  const bEnd =
    parseInt(b.end.split(":")[0]) * 60 + parseInt(b.end.split(":")[1]);
  return aStart < bEnd && bStart < aEnd;
}

const TimelinePage: React.FC = () => {
  const [events, setEvents] = useState<TimelineBusyInterval[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<
    (TimelineBusyInterval & { id?: number }) | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Загрузка событий из Supabase для выбранной даты
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const startOfSelectedDay = startOfDay(selectedDate).toISOString();
      const endOfSelectedDay = endOfDay(selectedDate).toISOString();

      const { data, error } = await supabase
        .from("schedule")
        .select("*")
        .gte("start", startOfSelectedDay)
        .lte("start", endOfSelectedDay)
        .order("start", { ascending: true });

      if (!error && data) {
        setEvents(
          data.map((e: ScheduleEvent) => ({
            ...e,
            start: e.start.slice(11, 16),
            end: e.end.slice(11, 16),
          }))
        );
      } else {
        setEvents([]);
        if (error) setError("Ошибка загрузки: " + error.message);
      }
      setLoading(false);
    };
    fetchEvents();
  }, [selectedDate]);

  const handleAdd = () => {
    setEditingEvent(null);
    setModalOpen(true);
    setError(null);
  };

  const handleEditEvent = (event: TimelineBusyInterval & { id?: number }) => {
    setEditingEvent(event);
    setModalOpen(true);
    setError(null);
  };

  const handleSave = async (event: TimelineBusyInterval) => {
    // Проверка на пересечение
    const isEdit = !!editingEvent;
    const filtered = isEdit
      ? events.filter((e) => e.id !== editingEvent?.id)
      : events;
    const overlap = filtered.some((e) => intervalsOverlap(e, event));
    if (overlap) {
      setError("Интервал пересекается с другим событием!");
      return;
    }
    setLoading(true);
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    if (isEdit && editingEvent?.id) {
      // Обновление
      const { error: updateError } = await supabase
        .from("schedule")
        .update({
          start: `${dateStr}T${event.start}:00Z`,
          end: `${dateStr}T${event.end}:00Z`,
          title: event.title,
          description: event.description,
        })
        .eq("id", editingEvent.id);
      if (updateError) {
        setError("Ошибка обновления: " + updateError.message);
        setLoading(false);
        return;
      }
    } else {
      // Добавление
      const { error: insertError } = await supabase.from("schedule").insert({
        start: `${dateStr}T${event.start}:00Z`,
        end: `${dateStr}T${event.end}:00Z`,
        title: event.title,
        description: event.description,
      });
      if (insertError) {
        setError("Ошибка добавления: " + insertError.message);
        setLoading(false);
        return;
      }
    }
    // Перезагрузка событий
    const startOfSelectedDay = startOfDay(selectedDate).toISOString();
    const endOfSelectedDay = endOfDay(selectedDate).toISOString();
    const { data, error: fetchError } = await supabase
      .from("schedule")
      .select("*")
      .gte("start", startOfSelectedDay)
      .lte("start", endOfSelectedDay)
      .order("start", { ascending: true });
    if (data) {
      setEvents(
        data.map((e: ScheduleEvent) => ({
          ...e,
          start: e.start.slice(11, 16),
          end: e.end.slice(11, 16),
        }))
      );
    } else {
      setEvents([]);
      if (fetchError) setError("Ошибка загрузки: " + fetchError.message);
    }
    setModalOpen(false);
    setError(null);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (editingEvent?.id) {
      setLoading(true);
      const { error: deleteError } = await supabase
        .from("schedule")
        .delete()
        .eq("id", editingEvent.id);
      if (deleteError) {
        setError("Ошибка удаления: " + deleteError.message);
        setLoading(false);
        return;
      }
      // Перезагрузка событий
      const { data, error: fetchError } = await supabase
        .from("schedule")
        .select("*")
        .order("start", { ascending: true });
      if (data) {
        setEvents(
          data.map((e: ScheduleEvent) => ({
            ...e,
            start: e.start.slice(11, 16),
            end: e.end.slice(11, 16),
          }))
        );
      } else {
        setEvents([]);
        if (fetchError) setError("Ошибка загрузки: " + fetchError.message);
      }
      setModalOpen(false);
      setError(null);
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
          <DatePicker
            label="Выберите дату"
            value={selectedDate}
            onChange={(newValue) => {
              if (newValue) setSelectedDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
          <Button variant="contained" color="primary" onClick={handleAdd}>
            Добавить событие
          </Button>
        </Box>
        <Timeline events={events} onEditEvent={handleEditEvent} />
        <TimelineEventForm
          open={modalOpen}
          event={editingEvent}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          onDelete={handleDelete}
          error={error}
          loading={loading}
        />
        {error && <Box sx={{ color: "error.main", mt: 2 }}>{error}</Box>}
      </Box>
    </LocalizationProvider>
  );
};

export default TimelinePage;
