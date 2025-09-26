// src/components/SidebarMenu.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SidebarMenu from "./SidebarMenu";

// Mock MUI DatePicker to just render an input
jest.mock("@mui/x-date-pickers/DatePicker", () => ({ value, onChange }) => (
  <input
    aria-label="datepicker"
    value={value || ""}
    onChange={(e) => onChange(e.target.value)}
  />
));

describe("SidebarMenu Component", () => {
  const mockOnClose = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnLogout = jest.fn();

  const appointments = [
    {
      id: 1,
      title: "Meeting 1",
      description: "Project discussion",
      start: new Date("2025-09-25T10:00:00"),
      end: new Date("2025-09-25T11:00:00"),
      isAllDay: false,
    },
    {
      id: 2,
      title: "All Day Event",
      description: "Conference",
      start: new Date("2025-09-26T00:00:00"),
      end: new Date("2025-09-26T23:59:59"),
      isAllDay: true,
    },
  ];

  beforeEach(() => jest.clearAllMocks());

  test("renders sidebar with header and logout button", () => {
    render(
      <SidebarMenu
        open={true}
        onClose={mockOnClose}
        appointments={appointments}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        drawerWidth={300}
        darkMode={false}
        onLogout={mockOnLogout}
      />
    );

    expect(screen.getByText(/Appointments/i)).toBeInTheDocument();
    expect(screen.getByText(/Manage your schedule/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Logout/i })).toBeInTheDocument();
  });

  test("renders upcoming appointments when no date selected", () => {
    render(
      <SidebarMenu
        open={true}
        onClose={mockOnClose}
        appointments={appointments}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        drawerWidth={300}
        darkMode={false}
        onLogout={mockOnLogout}
      />
    );

    expect(screen.getByText(/Meeting 1/i)).toBeInTheDocument();
    expect(screen.getByText(/All Day Event/i)).toBeInTheDocument();
  });

  test("calls onEdit when edit icon clicked", () => {
    render(
      <SidebarMenu
        open={true}
        onClose={mockOnClose}
        appointments={appointments}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        drawerWidth={300}
        darkMode={false}
        onLogout={mockOnLogout}
      />
    );

    const editButtons = screen.getAllByLabelText("Edit appointment");
    fireEvent.click(editButtons[0]);
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(appointments[0]);
  });

  test("calls onDelete with correct id when delete icon clicked", () => {
    render(
      <SidebarMenu
        open={true}
        onClose={mockOnClose}
        appointments={appointments}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        drawerWidth={300}
        darkMode={false}
        onLogout={mockOnLogout}
      />
    );

    const deleteButtons = screen.getAllByLabelText("Delete appointment");
    fireEvent.click(deleteButtons[0]);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(appointments[0].id);
  });

  test("calls onLogout when logout button clicked", () => {
    render(
      <SidebarMenu
        open={true}
        onClose={mockOnClose}
        appointments={appointments}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        drawerWidth={300}
        darkMode={false}
        onLogout={mockOnLogout}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Logout/i }));
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });
});
