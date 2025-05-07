import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { TimelineBusyInterval } from "./Timeline.types";

interface MobileTimelineProps {
  events: TimelineBusyInterval[];
  onEditEvent?: (event: TimelineBusyInterval) => void;
}

// Сортируем события по времени начала
function sortEvents(events: TimelineBusyInterval[]) {
  return [...events].sort((a, b) => a.start.localeCompare(b.start));
}

const MobileTimeline: React.FC<MobileTimelineProps> = ({
  events,
  onEditEvent,
}) => {
  const sortedEvents = sortEvents(events);

  return (
    <Box sx={{ p: 1 }}>
      {sortedEvents.length === 0 && (
        <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
          Нет событий на этот день
        </Typography>
      )}
      {sortedEvents.map((event, idx) => (
        <Box
          key={idx}
          sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}
        >
          <Typography
            sx={{
              minWidth: 48,
              color: "primary.main",
              fontWeight: 700,
              fontSize: "1.1em",
              pt: 1,
            }}
          >
            {event.start}
          </Typography>
          <Paper
            elevation={3}
            sx={{
              flex: 1,
              ml: 1,
              bgcolor: "error.main",
              color: "#fff",
              borderRadius: 2,
              px: 2,
              py: 1,
              boxShadow: 2,
              cursor: onEditEvent ? "pointer" : "default",
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
            }}
            onClick={onEditEvent ? () => onEditEvent(event) : undefined}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "1em",
                mb: 0.5,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {event.title}
            </Typography>
            {event.description && (
              <Typography
                sx={{
                  fontSize: "0.95em",
                  opacity: 0.85,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {event.description}
              </Typography>
            )}
            <Typography sx={{ fontSize: "0.85em", opacity: 0.7, mt: 0.5 }}>
              {event.start} — {event.end}
            </Typography>
          </Paper>
        </Box>
      ))}
    </Box>
  );
};

export default MobileTimeline;
