// src/components/AppointmentDetails.js
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Paper,
  IconButton,
  Stack,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import moment from 'moment';
import '../Styles/AppointmentDetails.css';

const AppointmentDetails = ({ appointment, onClose, onEdit, onDelete, darkMode }) => {
  if (!appointment) return null;

  const startLocal = new Date(appointment.start);
  const endLocal = new Date(appointment.end);

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{
      className: `details-dialog-paper ${darkMode ? "dark" : ""}`,
    }}>
      {/* Header */}
      <DialogTitle className="details-dialog-title">    
        <Typography variant="h6" className="details-title-text">
          {appointment.title}
        </Typography>
        <IconButton onClick={onClose} className="details-close-btn">
          <Close />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent dividers className="details-dialog-content">
        <Paper elevation={0} className="details-section">
          <Typography variant="subtitle1" className="details-section-heading">
            Description
          </Typography>
          <Typography variant="body1">
            {appointment.description || 'N/A'}
          </Typography>
        </Paper>

        <Paper elevation={0} className="details-section">
          <Typography variant="subtitle1" className="details-section-heading">
            Time
          </Typography>
          <Typography variant="body1">
            {appointment.allDay
              ? `All Day: ${moment(startLocal).format('MMM D, YYYY')}`
              : `${moment(startLocal).format('MMM D, YYYY h:mm A')} - ${moment(
                endLocal
              ).format('h:mm A')}`}
          </Typography>
        </Paper>

        <Paper elevation={0} className="details-section">
          <Typography variant="subtitle1" className="details-section-heading">
            Location
          </Typography>
          <Typography variant="body1">{appointment.location || 'N/A'}</Typography>
        </Paper>

        <Paper elevation={0} className="details-section">
          <Typography variant="subtitle1" className="details-section-heading">
            Attendees
          </Typography>
          <Typography variant="body1">{appointment.attendees || 'N/A'}</Typography>
        </Paper>
      </DialogContent>

      {/* Actions */}
      <DialogActions className="details-actions">
        <Stack direction="row" spacing={1}>
          <Button onClick={onEdit} className="details-edit-btn">
            Edit
          </Button>
          <Button onClick={() => onDelete(appointment.id)} className="details-delete-btn">
            Delete
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentDetails;
