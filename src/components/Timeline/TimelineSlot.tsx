import React from 'react';
import { Box, Typography } from '@mui/material';

interface TimelineSlotProps {
  time: string;
  isHour: boolean;
  isBusy: boolean;
  height: number;
}

const TimelineSlot: React.FC<TimelineSlotProps> = ({ time, isHour, isBusy, height }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      height: height,
      '&::before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: '50%',
        width: '100%',
        height: isHour ? '2px' : '1px',
        bgcolor: isBusy ? 'error.main' : (isHour ? 'primary.main' : 'grey.300'),
        zIndex: 1
      }
    }}
  >
    <Typography
      variant={isHour ? "body1" : "caption"}
      sx={{
        bgcolor: 'background.paper',
        pr: 2,
        zIndex: 2,
        color: isBusy ? 'error.main' : (isHour ? 'primary.main' : 'text.secondary'),
        fontWeight: isHour ? 'bold' : 'normal'
      }}
    >
      {time}
    </Typography>
    {isHour && (
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: isBusy ? 'error.main' : 'primary.main',
          zIndex: 2
        }}
      />
    )}
  </Box>
);

export default TimelineSlot; 