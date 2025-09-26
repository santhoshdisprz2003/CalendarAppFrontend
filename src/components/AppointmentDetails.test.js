import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppointmentDetails from './AppointmentDetails';

// Mock moment properly
jest.mock('moment', () => {
  const originalMoment = jest.requireActual('moment');
  return (date) => {
    return {
      format: (formatStr) => {
        if (formatStr === 'MMM D, YYYY') return 'Jan 1, 2023';
        if (formatStr === 'MMM D, YYYY h:mm A') return 'Jan 1, 2023 10:00 AM';
        if (formatStr === 'h:mm A') return '11:00 AM';
        return 'mocked-date';
      }
    };
  };
});

describe('AppointmentDetails Component', () => {
  const mockOnClose = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  
  const mockAppointment = {
    id: 1,
    title: 'Team Meeting',
    description: 'Weekly team sync',
    start: new Date('2023-01-01T10:00:00'),
    end: new Date('2023-01-01T11:00:00'),
    allDay: false,
    location: 'Conference Room A',
    attendees: 'John, Jane, Bob'
  };

  const mockAllDayAppointment = {
    ...mockAppointment,
    allDay: true
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders appointment title correctly', () => {
    render(
      <AppointmentDetails 
        appointment={mockAppointment}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByText('Team Meeting')).toBeInTheDocument();
  });

  test('renders appointment description correctly', () => {
    render(
      <AppointmentDetails 
        appointment={mockAppointment}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByText('Weekly team sync')).toBeInTheDocument();
  });

  test('renders appointment location correctly', () => {
    render(
      <AppointmentDetails 
        appointment={mockAppointment}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByText('Conference Room A')).toBeInTheDocument();
  });

  test('renders appointment attendees correctly', () => {
    render(
      <AppointmentDetails 
        appointment={mockAppointment}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByText('John, Jane, Bob')).toBeInTheDocument();
  });

  test('renders N/A for missing description', () => {
    const appointmentWithoutDescription = {
      ...mockAppointment,
      description: ''
    };
    
    render(
      <AppointmentDetails 
        appointment={appointmentWithoutDescription}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  test('renders N/A for missing location', () => {
    const appointmentWithoutLocation = {
      ...mockAppointment,
      location: ''
    };
    
    render(
      <AppointmentDetails 
        appointment={appointmentWithoutLocation}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const locationHeading = screen.getByText('Location');
    const locationSection = locationHeading.parentElement;
    expect(locationSection.textContent).toContain('N/A');
  });

  test('renders N/A for missing attendees', () => {
    const appointmentWithoutAttendees = {
      ...mockAppointment,
      attendees: ''
    };
    
    render(
      <AppointmentDetails 
        appointment={appointmentWithoutAttendees}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const attendeesHeading = screen.getByText('Attendees');
    const attendeesSection = attendeesHeading.parentElement;
    expect(attendeesSection.textContent).toContain('N/A');
  });

  test('calls onClose when close button is clicked', () => {
    render(
      <AppointmentDetails 
        appointment={mockAppointment}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const closeButtons = screen.getAllByRole('button');
    // Find the close button (usually the first one with no text)
    const closeButton = closeButtons.find(button => 
      button.getAttribute('aria-label') === 'close' || 
      button.textContent === '' ||
      button.querySelector('svg')
    );
    
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('calls onEdit when edit button is clicked', () => {
    render(
      <AppointmentDetails 
        appointment={mockAppointment}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    fireEvent.click(screen.getByText('Edit'));
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  test('calls onDelete with appointment id when delete button is clicked', () => {
    render(
      <AppointmentDetails 
        appointment={mockAppointment}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    fireEvent.click(screen.getByText('Delete'));
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  test('renders section headings correctly', () => {
    render(
      <AppointmentDetails 
        appointment={mockAppointment}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Attendees')).toBeInTheDocument();
  });

  test('renders all day format correctly', () => {
    render(
      <AppointmentDetails 
        appointment={mockAllDayAppointment}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const timeSection = screen.getByText('Time').parentElement;
    expect(timeSection.textContent).toContain('All Day');
  });
});
