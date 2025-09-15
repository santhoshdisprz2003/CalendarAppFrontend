import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './AppointmentForm.css';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { ErrorOutline, Close } from '@mui/icons-material';

const safeDate = (date) => {
  const d = new Date(date);
  return isNaN(d.getTime()) ? new Date() : d;
};

const AppointmentForm = ({ appointment, onSubmit, onCancel, open }) => {
  const [formData, setFormData] = useState({
    id: appointment?.id || 0,
    title: appointment?.title || '',
    description: appointment?.description || '',
    startTime: appointment?.startTime ? safeDate(appointment.startTime) : new Date(),
    endTime: appointment?.endTime ? safeDate(appointment.endTime) : new Date(),
    isAllDay: appointment?.isAllDay || false,
    location: appointment?.location || '',
    attendees: appointment?.attendees || '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (appointment) {
      setFormData({
        id: appointment.id,
        title: appointment.title,
        description: appointment.description,
        startTime: safeDate(appointment.startTime),
        endTime: safeDate(appointment.endTime),
        isAllDay: appointment.isAllDay,
        location: appointment.location || '',
        attendees: appointment.attendees || '',
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        id: 0,
        title: '',
        description: '',
        startTime: new Date(),
        endTime: new Date(),
        isAllDay: false,
        location: '',
        attendees: '',
      }));
      setErrors({});
    }
  }, [appointment, open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDateChange = (date, name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: date,
    }));
  };

  const validateForm = () => {
    let tempErrors = {};

    if (!(formData.title || '').trim()) tempErrors.title = 'Title is required';
    if (!(formData.description || '').trim()) tempErrors.description = 'Description is required';

    if (!formData.startTime) tempErrors.startTime = 'Start time is required';
    if (!formData.endTime) tempErrors.endTime = 'End time is required';

    if (formData.startTime && formData.endTime && formData.endTime <= formData.startTime) {
      tempErrors.endTime = 'End time must be after start time';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;
    if (!validateForm()) return;

    setSubmitting(true);

    const toUtc = (date) => new Date(date.getTime() - date.getTimezoneOffset() * 60000);

    const dataToSend = {
      ...formData,
      startTime: toUtc(formData.startTime).toISOString(),
      endTime: toUtc(formData.endTime).toISOString(),
    };

    try {
      await onSubmit(dataToSend);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{ className: 'appointment-dialog-paper' }}
    >
      <DialogTitle className="appointment-dialog-title">
        {formData.id ? 'Edit Appointment' : 'Create New Appointment'}
        <IconButton onClick={onCancel} className="appointment-close-btn">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers className="appointment-dialog-content">
        <Box component="form" noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title}
            InputProps={{
              endAdornment: errors.title && (
                <InputAdornment position="end">
                  <ErrorOutline color="error" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="description"
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            error={!!errors.description}
            helperText={errors.description}
            InputProps={{
              endAdornment: errors.description && (
                <InputAdornment position="end">
                  <ErrorOutline color="error" />
                </InputAdornment>
              ),
            }}
          />

          <Box className="appointment-date-box">
            <DatePicker
              selected={formData.startTime}
              onChange={(date) => handleDateChange(date, 'startTime')}
              showTimeSelect
              dateFormat="Pp"
              className="appointment-datepicker"
              customInput={
                <TextField
                  required
                  label="Start Time"
                  fullWidth
                  error={!!errors.startTime}
                  helperText={errors.startTime}
                />
              }
            />
            <DatePicker
              selected={formData.endTime}
              onChange={(date) => handleDateChange(date, 'endTime')}
              showTimeSelect
              dateFormat="Pp"
              className="appointment-datepicker"
              customInput={
                <TextField
                  required
                  label="End Time"
                  fullWidth
                  error={!!errors.endTime}
                  helperText={errors.endTime}
                />
              }
            />
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isAllDay}
                onChange={handleChange}
                name="isAllDay"
                color="primary"
              />
            }
            label="All Day Event"
          />

          <TextField
            margin="normal"
            fullWidth
            id="location"
            label="Location (optional)"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            fullWidth
            id="attendees"
            label="Attendees (comma-separated, optional)"
            name="attendees"
            value={formData.attendees}
            onChange={handleChange}
          />
        </Box>
      </DialogContent>

      <DialogActions className="appointment-dialog-actions">
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={18} /> : null}
          className="appointment-submit-btn"
        >
          {formData.id ? 'Update' : 'Create'}
        </Button>
        <Button variant="outlined" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentForm;
