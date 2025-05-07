import React from "react";
import { Box, Typography } from "@mui/material";
import { TimelineBusyInterval } from "./Timeline.types";
import { useTheme } from "@mui/material/styles";

interface TimelineSlotProps {
  time: string;
  isHour: boolean;
  isBusy: boolean;
  height: number;
  isPastBusy?: boolean;
  eventsInSlot?: TimelineBusyInterval[];
  onEditEvent?: (event: TimelineBusyInterval) => void;
}

// Вспомогательная функция для вычисления количества слотов (15 мин) между start и end
function getSlotSpan(start: string, end: string) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return Math.max(1, (eh * 60 + em - (sh * 60 + sm)) / 15);
}

const TimelineSlot: React.FC<TimelineSlotProps> = ({
  time,
  isHour,
  isBusy,
  height,
  isPastBusy = false,
  eventsInSlot = [],
  onEditEvent,
}) => {
  const theme = useTheme();

  // Проверяем, является ли время актуальным
  const isTimeActive = () => {
    const [hours, minutes] = time.split(":").map(Number);
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    return (
      hours > currentHours ||
      (hours === currentHours && minutes > currentMinutes)
    );
  };

  const isActive = isTimeActive();

  // Цвет линии, точки и текста: если isPastBusy — всегда серый
  const mainColor = isPastBusy
    ? "grey.300"
    : isActive
    ? isHour
      ? "primary.main"
      : "grey.300"
    : "grey.400";
  const dotColor = isPastBusy
    ? "grey.400"
    : isBusy
    ? "error.main"
    : isActive
    ? "primary.main"
    : "grey.400";
  const textColor = isPastBusy
    ? "grey.500"
    : isBusy
    ? "error.main"
    : isHour
    ? isActive
      ? "primary.main"
      : "grey.400"
    : isActive
    ? "text.secondary"
    : "grey.400";
  const finalBg = isPastBusy ? "grey.100" : "background.paper";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        position: "relative",
        height: height,
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: "50%",
          width: "100%",
          height: isHour ? "2px" : "1px",
          bgcolor: mainColor,
          zIndex: 1,
          opacity: 1,
        },
        flexDirection: "column",
        width: "100%",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
        <Typography
          variant={isHour ? "body1" : "caption"}
          sx={{
            bgcolor: finalBg,
            pr: 2,
            zIndex: 2,
            color: textColor,
            fontWeight: isHour ? "bold" : "normal",
            opacity: 1,
            minWidth: 44,
            textAlign: "right",
          }}
        >
          {time}
        </Typography>
        {isHour && (
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: dotColor,
              zIndex: 2,
              opacity: 1,
            }}
          />
        )}
      </Box>
      {/* Google Calendar style: события как полосы, растянутые по высоте */}
      {eventsInSlot.length > 0 && (
        <Box
          sx={{
            width: "100%",
            position: "absolute",
            left: 44,
            top: 0,
            display: { xs: "block", sm: "none" },
            zIndex: 3,
          }}
        >
          {eventsInSlot.map((event, idx) => {
            const slotSpan = getSlotSpan(event.start, event.end);
            return (
              <Box
                key={idx}
                sx={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "calc(100% - 8px)",
                  height: `calc(${slotSpan} * ${height}px - 4px)`,
                  bgcolor: theme.palette.error.main,
                  color: "#fff",
                  borderRadius: 2,
                  boxShadow: 2,
                  px: 1.5,
                  py: 0.5,
                  fontSize: "1rem",
                  textAlign: "left",
                  cursor: onEditEvent ? "pointer" : "default",
                  display: "flex",
                  alignItems: "center",
                  overflow: "hidden",
                  zIndex: 3,
                  marginTop: `${idx * 4}px`,
                }}
                onClick={onEditEvent ? () => onEditEvent(event) : undefined}
              >
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "1em",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {event.title}
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default TimelineSlot;
