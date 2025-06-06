import React, { useState, useEffect } from "react";
import Timeline from "../components/Timeline";
import { TimelineBusyInterval } from "../components/Timeline/Timeline.types";
import { Box, Button, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ru } from "date-fns/locale";
import { format, startOfDay, endOfDay } from "date-fns";
import { supabase } from "../supabaseClient";
import CalendarPicker from "../components/CalendarPicker";
import DesktopTimelineEventForm from "../components/Timeline/DesktopTimelineEventForm";
import MobileTimelineEventForm from "../components/Timeline/MobileTimelineEventForm";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

interface ScheduleEvent {
  id: number;
  start: string;
  end: string;
  title: string;
  description: string;
}

interface EventDates {
  [key: string]: boolean;
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [eventDates, setEventDates] = useState<EventDates>({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Загрузка всех дат с событиями
  useEffect(() => {
    const fetchEventDates = async () => {
      const { data, error } = await supabase.from("schedule").select("start");

      if (!error && data) {
        const dates: EventDates = {};
        data.forEach((event: { start: string }) => {
          const date = event.start.split("T")[0];
          dates[date] = true;
        });
        setEventDates(dates);
      }
    };
    fetchEventDates();
  }, []);

  // Загрузка событий из Supabase для выбранной даты
  useEffect(() => {
    const fetchEvents = async () => {
      if (!selectedDate) {
        setEvents([]);
        setLoading(false);
        return;
      }
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
    if (!selectedDate) return;
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
    // Обновляем список дат с событиями
    setEventDates((prev) => ({ ...prev, [dateStr]: true }));
    // Перезагрузка событий
    if (!selectedDate) return;
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
      // Проверяем, остались ли еще события на эту дату
      if (!selectedDate) return;
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const { data: remainingEvents } = await supabase
        .from("schedule")
        .select("start")
        .gte("start", `${dateStr}T00:00:00Z`)
        .lte("start", `${dateStr}T23:59:59Z`);

      if (!remainingEvents || remainingEvents.length === 0) {
        setEventDates((prev) => {
          const newDates = { ...prev };
          delete newDates[dateStr];
          return newDates;
        });
        setSelectedDate(null);
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
      <Box
        sx={{
          p: 2,
          display: "flex",
          gap: 2,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "flex-start" },
          justifyContent: { xs: "flex-start", sm: "flex-start" },
        }}
      >
        <CalendarPicker
          selectedDate={selectedDate}
          onChange={(newValue) => {
            if (newValue) setSelectedDate(newValue);
          }}
          eventDates={eventDates}
        />
        <Box
          sx={{
            flex: 1,
            minWidth: { xs: 0, sm: 400 },
            maxWidth: { xs: "100%", sm: 900 },
            mt: { xs: 2, sm: 0 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 2,
              alignItems: "center",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <DatePicker
              label="Выберите дату"
              value={selectedDate}
              onChange={(newValue) => {
                if (newValue) setSelectedDate(newValue);
              }}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAdd}
              sx={{ width: { xs: "100%", sm: "auto" }, mt: { xs: 1, sm: 0 } }}
            >
              Добавить событие
            </Button>
          </Box>
          <Timeline events={events} onEditEvent={handleEditEvent} />
          {isMobile ? (
            <MobileTimelineEventForm
              open={modalOpen}
              event={editingEvent}
              onClose={() => setModalOpen(false)}
              onSave={handleSave}
              onDelete={handleDelete}
              error={error}
              loading={loading}
            />
          ) : (
            <DesktopTimelineEventForm
              open={modalOpen}
              event={editingEvent}
              onClose={() => setModalOpen(false)}
              onSave={handleSave}
              onDelete={handleDelete}
              error={error}
              loading={loading}
            />
          )}
          {error && <Box sx={{ color: "error.main", mt: 2 }}>{error}</Box>}
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default TimelinePage;
