import axios from 'axios';
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment
} from './appointments';

// Mock axios
jest.mock('axios', () => {
  // Create mock functions for all methods
  const mockGet = jest.fn();
  const mockPost = jest.fn();
  const mockPut = jest.fn();
  const mockDelete = jest.fn();
  const mockRequestUse = jest.fn();
  
  // Create the mock axios instance that will be returned by axios.create()
  const mockAxiosInstance = {
    get: mockGet,
    post: mockPost,
    put: mockPut,
    delete: mockDelete,
    interceptors: {
      request: {
        use: mockRequestUse
      }
    }
  };
  
  // Return the mock axios with create method that returns our instance
  return {
    create: jest.fn(() => mockAxiosInstance),
    mockAxiosInstance, // Expose the instance for direct access in tests
    mockGet,
    mockPost,
    mockPut,
    mockDelete,
    mockRequestUse
  };
});

describe('Appointments API', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Set up localStorage mock
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'mock-token'),
        setItem: jest.fn(),
        removeItem: jest.fn()
      },
      writable: true
    });
  });

  test('getAppointments fetches data from the correct endpoint', async () => {
    // Setup
    const mockResponse = { data: [{ id: 1, title: 'Meeting' }] };
    axios.mockGet.mockResolvedValueOnce(mockResponse);

    // Execute
    const result = await getAppointments();

    // Assert
    expect(axios.mockGet).toHaveBeenCalledWith('/appointments');
    expect(result).toEqual(mockResponse.data);
  });

  test('createAppointment sends data to the correct endpoint', async () => {
    // Setup
    const appointmentData = { 
      title: 'New Meeting', 
      description: 'Discuss project',
      startTime: new Date(),
      endTime: new Date()
    };
    const mockResponse = { data: { id: 1, ...appointmentData } };
    axios.mockPost.mockResolvedValueOnce(mockResponse);

    // Execute
    const result = await createAppointment(appointmentData);

    // Assert
    expect(axios.mockPost).toHaveBeenCalledWith('/appointments', appointmentData);
    expect(result).toEqual(mockResponse.data);
  });

  test('updateAppointment sends data to the correct endpoint with ID', async () => {
    // Setup
    const id = 1;
    const appointmentData = { 
      title: 'Updated Meeting', 
      description: 'Revised agenda',
      startTime: new Date(),
      endTime: new Date()
    };
    const mockResponse = { data: { id, ...appointmentData } };
    axios.mockPut.mockResolvedValueOnce(mockResponse);

    // Execute
    const result = await updateAppointment(id, appointmentData);

    // Assert
    expect(axios.mockPut).toHaveBeenCalledWith(`/appointments/${id}`, appointmentData);
    expect(result).toEqual(mockResponse.data);
  });

  test('deleteAppointment sends request to the correct endpoint with ID', async () => {
    // Setup
    const id = 1;
    const mockResponse = { data: { message: 'Appointment deleted' } };
    axios.mockDelete.mockResolvedValueOnce(mockResponse);

    // Execute
    const result = await deleteAppointment(id);

    // Assert
    expect(axios.mockDelete).toHaveBeenCalledWith(`/appointments/${id}`);
    expect(result).toEqual(mockResponse.data);
  });

  test('createAppointment bubbles up errors', async () => {
    // Setup
    const error = new Error('Network error');
    axios.mockPost.mockRejectedValueOnce(error);
    
    // Execute & Assert
    await expect(createAppointment({})).rejects.toThrow('Network error');
  });

  test('updateAppointment bubbles up errors', async () => {
    // Setup
    const error = new Error('Server error');
    axios.mockPut.mockRejectedValueOnce(error);
    
    // Execute & Assert
    await expect(updateAppointment(1, {})).rejects.toThrow('Server error');
  });
});
