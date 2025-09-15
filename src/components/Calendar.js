import React, { useState, useEffect, useCallback } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Snackbar,
  Alert,
  Button,
  Stack,
  AppBar,
  Toolbar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SidebarMenu from "./SidebarMenu";
import AppointmentForm from "./AppointmentForm";
import AppointmentDetails from "./AppointmentDetails";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "../api/appointments";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.css";

const localizer = momentLocalizer(moment);

function CustomToolbar({ label, onNavigate, onView, currentView }) {
  const views = ["month", "week", "day", "agenda"];

  return (
    <Box className="calendar-toolbar">
      <Stack direction="row" spacing={1}>
        <Button onClick={() => onNavigate("PREV")} className="calendar-nav-btn">
          <ArrowBackIcon sx={{ mr: 1 }} />
        </Button>
        <Button onClick={() => onNavigate("NEXT")} className="calendar-nav-btn">
          <ArrowForwardIcon sx={{ ml: 1 }} />
        </Button>
      </Stack>

      <Typography variant="h6" fontWeight={600}>
        {label}
      </Typography>

      <Stack direction="row" spacing={1}>
        {views.map((v) => (
          <Button
            key={v}
            variant="outlined"
            onClick={() => onView(v)}
            className={v === currentView ? "rbc-active" : ""}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </Button>
        ))}
      </Stack>
    </Box>
  );
}

function Calendar() {
  const [events, setEvents] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formMode, setFormMode] = useState("create");
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [conflictMsg, setConflictMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState("month");

  const drawerWidth = 320;

  const fetchAppointments = useCallback(async () => {
    try {
      const data = await getAppointments();
      const formattedEvents = data.map((app) => {
        const toLocal = (dateStr) => {
          const d = new Date(dateStr);
          return new Date(d.getTime() + d.getTimezoneOffset() * 60000);
        };
        return {
          id: app.id,
          title: app.title,
          start: toLocal(app.startTime),
          end: toLocal(app.endTime),
          allDay: app.isAllDay,
          description: app.description,
          location: app.location,
          attendees: app.attendees,
        };
      });
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleFormSubmit = async (data) => {
    try {
      if (formMode === "create") {
        await createAppointment(data);
        setSuccessMsg("Appointment created successfully!");
      } else {
        const id = data.id || data?.Id || 0;
        await updateAppointment(id, data);
        setSuccessMsg("Appointment updated successfully!");
      }

      await fetchAppointments();
      setShowForm(false);
      setConflictMsg("");
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setConflictMsg(err.response.data?.message || "Appointment conflict detected");
      } else {
        console.error(err);
      }
      throw err;
    }
  };

  return (
    <Box className={`calendar-root ${darkMode ? "dark" : "light"}`}>
      <SidebarMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        appointments={events}
        onDelete={async (id) => {
          try {
            await deleteAppointment(id);
            await fetchAppointments();
            setSuccessMsg("Appointment deleted successfully!");
          } catch (err) {
            setConflictMsg("Failed to delete appointment.");
          }
        }}
        onEdit={(app) => {
          setSelectedAppointment(app);
          setFormMode("edit");
          setShowForm(true);
        }}
        drawerWidth={drawerWidth}
      />

      <Box
        component="main"
        className={`calendar-main ${menuOpen ? "menu-open" : ""}`}
        style={{
          marginLeft: menuOpen ? `${drawerWidth}px` : 0,
          width: menuOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
        }}
      >
        <AppBar position="static" className="calendar-appbar">
          <Toolbar>
            <IconButton edge="start" onClick={() => setMenuOpen(true)} className="calendar-menu-btn">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
              Calendar Appointment App
            </Typography>
          </Toolbar>
        </AppBar>

        <Box className="calendar-container">
          <Paper elevation={3} className="calendar-header">
            <Typography variant="h4" fontWeight={600} align="center">Calendar</Typography>

            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={() => setDarkMode(!darkMode)} className="calendar-toggle-btn">
                {darkMode ? "Switch Light Mode" : "Switch Dark Mode"}
              </Button>
              <Button variant="contained" onClick={() => { setFormMode("create"); setSelectedAppointment(null); setShowForm(true); }} className="calendar-create-btn">
                + New Appointment
              </Button>
            </Stack>
          </Paper>

          <Paper elevation={3} className="calendar-wrapper">
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              selectable
              style={{ height: "100%" }}
              view={currentView}
              onView={(view) => setCurrentView(view)}
              components={{ toolbar: (props) => <CustomToolbar {...props} currentView={currentView} /> }}
              onSelectEvent={(event) => { setSelectedAppointment(event); setShowDetails(true); }}
              eventPropGetter={() => ({ className: "calendar-event" })}
            />
          </Paper>
        </Box>
      </Box>

      {showForm && <AppointmentForm open={showForm} appointment={formMode === "edit" ? selectedAppointment : null} onSubmit={handleFormSubmit} onCancel={() => setShowForm(false)} />}
      {showDetails && selectedAppointment && <AppointmentDetails appointment={selectedAppointment} onClose={() => setShowDetails(false)} onEdit={() => { setFormMode("edit"); setShowDetails(false); setShowForm(true); }} onDelete={async (id) => { await deleteAppointment(id); await fetchAppointments(); setShowDetails(false); setSuccessMsg("Appointment deleted successfully!"); }} />}

      <Snackbar open={!!successMsg} autoHideDuration={4000} onClose={() => setSuccessMsg("")} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="success" onClose={() => setSuccessMsg("")}>{successMsg}</Alert>
      </Snackbar>

      <Snackbar open={!!conflictMsg} autoHideDuration={5000} onClose={() => setConflictMsg("")} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="error" onClose={() => setConflictMsg("")}>{conflictMsg}</Alert>
      </Snackbar>
    </Box>
  );
}

export default Calendar;
