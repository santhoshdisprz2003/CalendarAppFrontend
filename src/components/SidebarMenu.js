import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Paper,
  Stack,
  Chip,
} from "@mui/material";
import { Delete, Edit, CalendarMonth } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "./SidebarMenu.css";

const SidebarMenu = ({ open, onClose, appointments, onDelete, onEdit, drawerWidth }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  // Filter appointments by selected date
  const filteredAppointments = selectedDate
    ? appointments.filter((app) => dayjs(app.start).isSame(selectedDate, "day"))
    : [];

  // Show all upcoming if no date selected
  const upcomingAppointments =
    !selectedDate && appointments.length > 0
      ? [...appointments]
          .filter((app) => dayjs(app.start).isAfter(dayjs()))
          .sort((a, b) => new Date(a.start) - new Date(b.start))
      : [];

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{ className: "sidebar-drawer" }}
    >
      <Box className="sidebar-container">
        {/* Sidebar Header */}
        <Box className="sidebar-header">
          <Stack direction="row" alignItems="center" spacing={1}>
            <CalendarMonth sx={{ color: "#1976d2" }} />
            <Typography variant="h5" className="sidebar-header-title">
              Appointments
            </Typography>
          </Stack>
          <Typography variant="body2" className="sidebar-header-subtitle">
            Manage your schedule
          </Typography>
        </Box>

        {/* Date Picker */}
        <Box className="sidebar-datepicker">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              slotProps={{
                textField: { fullWidth: true, size: "small" },
              }}
            />
          </LocalizationProvider>
        </Box>

        {/* Show chip for selected date */}
        {selectedDate && (
          <Box className="sidebar-chip">
            <Chip
              label={
                dayjs().isSame(selectedDate, "day")
                  ? `Today - ${selectedDate.format("MMM D, YYYY")}`
                  : selectedDate.format("dddd, MMM D, YYYY")
              }
              color="primary"
              variant="filled"
            />
          </Box>
        )}

        {/* Upcoming Appointments Header */}
        <Box className="sidebar-upcoming-header">
          <Typography variant="subtitle1">
            Upcoming Appointments
          </Typography>
        </Box>

        {/* Appointment List */}
        <Box className="sidebar-appointment-list">
          <List>
            {/* If date chosen */}
            {selectedDate && filteredAppointments.length === 0 && (
              <Typography className="sidebar-empty">
                No appointments for this date
              </Typography>
            )}
            {selectedDate &&
              filteredAppointments.map((app) => (
                <Paper
                  key={app.id}
                  elevation={3}
                  className={`sidebar-card ${app.isAllDay ? "allday" : "timed"}`}
                >
                  <ListItemText
                    primary={`${app.title} ${
                      app.isAllDay
                        ? "(All Day)"
                        : `(${new Date(app.start).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })} - ${new Date(app.end).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })})`
                    }`}
                    secondary={app.description}
                  />
                  <Box>
                    <IconButton onClick={() => onEdit(app)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => onDelete(app.id)}>
                      <Delete fontSize="small" color="error" />
                    </IconButton>
                  </Box>
                </Paper>
              ))}

            {/* If no date chosen → show all upcoming */}
            {!selectedDate &&
              (upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((app) => (
                  <Paper
                    key={app.id}
                    elevation={3}
                    className={`sidebar-card ${app.isAllDay ? "allday" : "timed"}`}
                  >
                    <ListItemText
                      primary={`${app.title} ${
                        app.isAllDay
                          ? "(All Day)"
                          : `(${new Date(app.start).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })} - ${new Date(app.end).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })})`
                      }`}
                      secondary={app.description}
                    />
                    <Box>
                      <IconButton onClick={() => onEdit(app)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => onDelete(app.id)}>
                        <Delete fontSize="small" color="error" />
                      </IconButton>
                    </Box>
                  </Paper>
                ))
              ) : (
                <Typography className="sidebar-empty">
                  No upcoming appointments
                </Typography>
              ))}
          </List>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SidebarMenu;
