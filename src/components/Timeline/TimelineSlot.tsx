import React from "react";
import { Box, Typography } from "@mui/material";

interface TimelineSlotProps {
  time: string;
  isHour: boolean;
  isBusy: boolean;
  height: number;
  isPastBusy?: boolean;
}

const TimelineSlot: React.FC<TimelineSlotProps> = ({
  time,
  isHour,
  isBusy,
  height,
  isPastBusy = false,
}) => {
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
      }}
    >
      <Typography
        variant={isHour ? "body1" : "caption"}
        sx={{
          bgcolor: finalBg,
          pr: 2,
          zIndex: 2,
          color: textColor,
          fontWeight: isHour ? "bold" : "normal",
          opacity: 1,
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
  );
};

export default TimelineSlot;
