// src/components/Calendar.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Calendar from "./Calendar";
import { getAppointments } from "../api/appointments";

// ---------------------------
// Mock API calls
// ---------------------------
jest.mock("../api/appointments", () => ({
  getAppointments: jest.fn(),
}));

// ---------------------------
// Mock child components
// ---------------------------
jest.mock("./SidebarMenu", () => ({ open }) => (
  <div data-testid="sidebar">{open ? "Open" : "Closed"}</div>
));
jest.mock("./AppointmentForm", () => ({ open }) => (
  <div data-testid="appointment-form">{open ? "Open" : "Closed"}</div>
));
jest.mock("./AppointmentDetails", () => ({ appointment }) => (
  <div data-testid="appointment-details">{appointment ? "Open" : "Closed"}</div>
));

// ---------------------------
// Test Suite
// ---------------------------
describe("Calendar Component", () => {
  const mockOnLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---------- Render & basic elements ----------
  test("renders calendar header and buttons", async () => {
    getAppointments.mockResolvedValueOnce([]);
    render(<Calendar onLogout={mockOnLogout} />);

    expect(await screen.findByText(/Calendar/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /New Appointment/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Switch Dark Mode/i })).toBeInTheDocument();
  });

  test("toggles dark mode", async () => {
    getAppointments.mockResolvedValueOnce([]);
    render(<Calendar onLogout={mockOnLogout} />);

    const toggleBtn = screen.getByRole("button", { name: /Switch Dark Mode/i });
    fireEvent.click(toggleBtn);

    expect(screen.getByText(/Switch Light Mode/i)).toBeInTheDocument();
  });

  test("opens AppointmentForm on New Appointment click", async () => {
    getAppointments.mockResolvedValueOnce([]);
    render(<Calendar onLogout={mockOnLogout} />);

    fireEvent.click(screen.getByRole("button", { name: /\+ New Appointment/i }));
    expect(screen.getByTestId("appointment-form")).toHaveTextContent("Open");
  });

  // ---------- Event fetching ----------
  test("fetches events on mount", async () => {
    const mockEvents = [
      {
        id: 1,
        title: "Meeting",
        startTime: new Date(),
        endTime: new Date(),
        isAllDay: false,
      },
    ];
    getAppointments.mockResolvedValueOnce(mockEvents);

    render(<Calendar onLogout={mockOnLogout} />);
    await waitFor(() => expect(getAppointments).toHaveBeenCalledTimes(1));
  });
});
