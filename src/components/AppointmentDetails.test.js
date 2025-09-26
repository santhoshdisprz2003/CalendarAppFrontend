// src/components/AppointmentDetails.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AppointmentDetails from "./AppointmentDetails";
import moment from "moment";

describe("AppointmentDetails Component", () => {
  const mockOnClose = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  const appointment = {
    id: 1,
    title: "Team Meeting",
    description: "Discuss project progress",
    start: new Date("2025-09-25T10:00:00"),
    end: new Date("2025-09-25T11:00:00"),
    allDay: false,
    location: "Conference Room",
    attendees: "Alice, Bob",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders appointment details correctly", () => {
    render(
      <AppointmentDetails
        appointment={appointment}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        darkMode={false}
      />
    );

    expect(screen.getByText("Team Meeting")).toBeInTheDocument();
    expect(screen.getByText("Discuss project progress")).toBeInTheDocument();
    expect(screen.getByText("Conference Room")).toBeInTheDocument();
    expect(screen.getByText("Alice, Bob")).toBeInTheDocument();

    const timeText = `${moment(appointment.start).format(
      "MMM D, YYYY h:mm A"
    )} - ${moment(appointment.end).format("h:mm A")}`;
    expect(screen.getByText(timeText)).toBeInTheDocument();
  });

  test("renders 'N/A' when optional fields are missing", () => {
    const minimalAppointment = {
      id: 2,
      title: "No Info",
      description: "",
      start: new Date(),
      end: new Date(),
      allDay: false,
      location: "",
      attendees: "",
    };

    render(
      <AppointmentDetails
        appointment={minimalAppointment}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        darkMode={false}
      />
    );

    expect(screen.getByText("No Info")).toBeInTheDocument();
    expect(screen.getAllByText("N/A").length).toBe(3); // Description, Location, Attendees
  });

  test("calls onClose when close button clicked", () => {
    render(
      <AppointmentDetails
        appointment={appointment}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        darkMode={false}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("calls onEdit when Edit button clicked", () => {
    render(
      <AppointmentDetails
        appointment={appointment}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        darkMode={false}
      />
    );

    fireEvent.click(screen.getByText(/Edit/i));
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  test("calls onDelete with appointment id when Delete button clicked", () => {
    render(
      <AppointmentDetails
        appointment={appointment}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        darkMode={false}
      />
    );

    fireEvent.click(screen.getByText(/Delete/i));
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(appointment.id);
  });

  test("returns null if no appointment provided", () => {
    const { container } = render(
      <AppointmentDetails
        appointment={null}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        darkMode={false}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  test("applies dark mode class when darkMode is true", () => {
    render(
      <AppointmentDetails
        appointment={appointment}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        darkMode={true}
      />
    );

    expect(document.querySelector(".details-dialog-paper")).toHaveClass("dark");
  });
});
