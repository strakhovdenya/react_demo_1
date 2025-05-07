import React from "react";
import { Box, Typography } from "@mui/material";

interface TimelineBackgroundBlockProps {
  top: number;
  height: number;
  title: string;
  description: string;
  onClick?: () => void;
}

const TimelineBackgroundBlock: React.FC<TimelineBackgroundBlockProps> = ({
  top,
  height,
  title,
  description,
  onClick,
}) => (
  <>
    {/* Кликабельный слой */}
    <Box
      sx={{
        position: "absolute",
        left: { xs: "5%", sm: "20%" },
        right: { xs: "5%", sm: "20%" },
        top: top,
        height: height,
        zIndex: 3,
        cursor: onClick ? "pointer" : "default",
        background: "transparent",
      }}
      onClick={onClick}
    />
    {/* Фоновый блок */}
    <Box
      sx={{
        position: "absolute",
        left: { xs: "5%", sm: "20%" },
        right: { xs: "5%", sm: "20%" },
        top: top,
        height: height,
        bgcolor: "error.light",
        opacity: 0.2,
        zIndex: 0,
        borderLeft: "3px solid",
        borderRight: "3px solid",
        borderColor: "error.main",
        pointerEvents: "none",
      }}
    />
    {/* Красивый заголовок */}
    <Box
      sx={{
        position: "absolute",
        left: { xs: 0, sm: "25%" },
        right: { xs: 0, sm: "25%" },
        top: top + height * 0.25,
        transform: "translateY(-50%)",
        zIndex: 2,
        bgcolor: { xs: "rgba(211,47,47,0.85)", sm: "rgba(211,47,47,0.85)" },
        color: "white",
        px: { xs: 1, sm: 2 },
        py: { xs: 0.5, sm: 1 },
        borderRadius: { xs: 2, sm: 2 },
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: { xs: 0, sm: 120 },
        maxWidth: { xs: "100%", sm: 260 },
        pointerEvents: "none",
        textAlign: "center",
        wordBreak: "break-word",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: "bold",
          lineHeight: 1.2,
          width: "100%",
          wordBreak: "break-word",
          textAlign: "center",
          fontSize: { xs: "1rem", sm: "1.1rem" },
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          opacity: 0.85,
          textAlign: "center",
          width: "100%",
          wordBreak: "break-word",
          fontSize: { xs: "0.85rem", sm: "0.95rem" },
        }}
      >
        {description}
      </Typography>
    </Box>
  </>
);

export default TimelineBackgroundBlock;
