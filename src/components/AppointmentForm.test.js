// src/components/AppointmentForm.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AppointmentForm from "./AppointmentForm";

// ---------------------------
// Mock react-datepicker
// ---------------------------
jest.mock("react-datepicker", () => (props) => {
  const { selected, onChange } = props;
  return (
    <input
      type="datetime-local"
      value={selected ? selected.toISOString().substring(0, 16) : ""}
      onChange={(e) => onChange(new Date(e.target.value))}
      aria-label={props.customInput?.props?.label || "DatePicker"}
    />
  );
});

// ---------------------------
// Test Suite
// ---------------------------
describe("AppointmentForm Component", () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders correctly in create mode", () => {
    render(
      <AppointmentForm open={true} appointment={null} onSubmit={mockOnSubmit} onCancel={mockOnCancel} darkMode={false} />
    );

    expect(screen.getByText(/Create New Appointment/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
  });

  test("renders correctly in edit mode", () => {
    const appointment = {
      id: 1,
      title: "Meeting",
      description: "Discuss project",
      startTime: new Date(),
      endTime: new Date(),
      isAllDay: false,
      location: "Office",
      attendees: "John",
    };

    render(
      <AppointmentForm open={true} appointment={appointment} onSubmit={mockOnSubmit} onCancel={mockOnCancel} darkMode={false} />
    );

    expect(screen.getByText(/Edit Appointment/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("Meeting")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Discuss project")).toBeInTheDocument();
  });

  test("validates required fields", async () => {
    render(
      <AppointmentForm open={true} appointment={null} onSubmit={mockOnSubmit} onCancel={mockOnCancel} darkMode={false} />
    );

    fireEvent.click(screen.getByRole("button", { name: /Create/i }));

    await waitFor(() => {
      expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Description is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test("calls onSubmit with valid data", async () => {
    render(
      <AppointmentForm open={true} appointment={null} onSubmit={mockOnSubmit} onCancel={mockOnCancel} darkMode={false} />
    );

    // Fill required fields
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: "Test Meeting" } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: "Test Desc" } });

    // Set valid start and end times
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60000);
    fireEvent.change(screen.getByLabelText(/Start Time/i), { target: { value: now.toISOString().substring(0, 16) } });
    fireEvent.change(screen.getByLabelText(/End Time/i), { target: { value: oneHourLater.toISOString().substring(0, 16) } });

    fireEvent.click(screen.getByRole("button", { name: /Create/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        title: "Test Meeting",
        description: "Test Desc",
      }));
    });
  });

  test("calls onCancel when cancel button clicked", () => {
    render(
      <AppointmentForm open={true} appointment={null} onSubmit={mockOnSubmit} onCancel={mockOnCancel} darkMode={false} />
    );

    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});
