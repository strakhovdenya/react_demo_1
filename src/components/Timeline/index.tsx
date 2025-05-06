import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import TimelineBackgroundBlock from "./TimelineBackgroundBlock";
import TimelineSlot from "./TimelineSlot";
import { getSlotHeight, getIntervalPosition } from "./timelineUtils";
import { TimelineSlotType, TimelineBusyInterval } from "./Timeline.types";

interface TimelineProps {
  events: TimelineBusyInterval[];
  onEditEvent?: (event: TimelineBusyInterval) => void;
}

const Timeline: React.FC<TimelineProps> = ({ events, onEditEvent }) => {
  // Создаем массив временных меток с интервалом в 15 минут
  const timeSlots: TimelineSlotType[] = Array.from(
    { length: 24 * 4 },
    (_, i) => {
      const hours = Math.floor(i / 4);
      const minutes = (i % 4) * 15;
      return {
        time: `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`,
        isHour: minutes === 0,
      };
    }
  );

  // Используем события, переданные через пропсы
  const busyIntervals = events;

  // Функция для проверки, находится ли временная метка в занятом интервале
  const isTimeInBusyInterval = (time: string) => {
    return busyIntervals.some((interval) => {
      const timeInMinutes =
        parseInt(time.split(":")[0]) * 60 + parseInt(time.split(":")[1]);
      const startInMinutes =
        parseInt(interval.start.split(":")[0]) * 60 +
        parseInt(interval.start.split(":")[1]);
      const endInMinutes =
        parseInt(interval.end.split(":")[0]) * 60 +
        parseInt(interval.end.split(":")[1]);
      return timeInMinutes >= startInMinutes && timeInMinutes < endInMinutes;
    });
  };

  // Новая функция: временная метка внутри события, которое уже завершилось
  const isTimeInPastBusyInterval = (time: string) => {
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    return busyIntervals.some((interval) => {
      const startInMinutes =
        parseInt(interval.start.split(":")[0]) * 60 +
        parseInt(interval.start.split(":")[1]);
      const endInMinutes =
        parseInt(interval.end.split(":")[0]) * 60 +
        parseInt(interval.end.split(":")[1]);
      return (
        parseInt(time.split(":")[0]) * 60 + parseInt(time.split(":")[1]) >=
          startInMinutes &&
        parseInt(time.split(":")[0]) * 60 + parseInt(time.split(":")[1]) <
          endInMinutes &&
        endInMinutes <= nowMinutes // событие уже завершилось
      );
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 3,
        height: "100vh",
        overflow: "auto",
        bgcolor: "background.default",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: "primary.main",
          fontWeight: "bold",
          mb: 4,
        }}
      >
        Таймлайн
      </Typography>

      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 800,
          p: 3,
          position: "relative",
          bgcolor: "background.paper",
          borderRadius: 2,
        }}
      >
        <Box sx={{ position: "relative" }}>
          {/* Фоновые блоки для занятых интервалов */}
          {busyIntervals.map((interval, index) => {
            const { top, height } = getIntervalPosition(
              timeSlots,
              interval.start,
              interval.end
            );
            return (
              <TimelineBackgroundBlock
                key={index}
                top={top}
                height={height}
                title={interval.title}
                description={interval.description}
                onClick={onEditEvent ? () => onEditEvent(interval) : undefined}
              />
            );
          })}

          {/* Временные метки */}
          {timeSlots.map((slot, index) => (
            <TimelineSlot
              key={slot.time}
              time={slot.time}
              isHour={slot.isHour}
              isBusy={isTimeInBusyInterval(slot.time)}
              isPastBusy={isTimeInPastBusyInterval(slot.time)}
              height={getSlotHeight(slot)}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default Timeline;
