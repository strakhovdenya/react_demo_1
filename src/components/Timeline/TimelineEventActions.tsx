import React from "react";
import { DialogActions, Button, Box } from "@mui/material";

interface TimelineEventActionsProps {
  isEdit: boolean;
  loading?: boolean;
  onDelete?: () => void;
  onClose: () => void;
  onSave: () => void;
  isSaveDisabled: boolean;
  isMobile?: boolean;
}

const TimelineEventActions: React.FC<TimelineEventActionsProps> = ({
  isEdit,
  loading,
  onDelete,
  onClose,
  onSave,
  isSaveDisabled,
  isMobile = false,
}) => (
  <DialogActions
    sx={
      isMobile
        ? {
            p: "8px 12px",
            flexDirection: "column-reverse",
            alignItems: "stretch",
          }
        : {
            p: "16px 24px",
            display: "flex",
            justifyContent: "space-between",
          }
    }
  >
    {isEdit && onDelete && (
      <Button
        onClick={onDelete}
        color="error"
        disabled={loading}
        fullWidth={isMobile}
        sx={isMobile ? { mb: 1 } : undefined}
      >
        Удалить
      </Button>
    )}
    <Box
      sx={
        isMobile
          ? {
              display: "flex",
              gap: 1,
              width: "100%",
              justifyContent: "space-between",
            }
          : { display: "flex", gap: 1 }
      }
    >
      <Button onClick={onClose} disabled={loading} fullWidth={isMobile}>
        Отмена
      </Button>
      <Button
        onClick={onSave}
        variant="contained"
        disabled={isSaveDisabled || loading}
        fullWidth={isMobile}
      >
        Сохранить
      </Button>
    </Box>
  </DialogActions>
);

export default TimelineEventActions;
