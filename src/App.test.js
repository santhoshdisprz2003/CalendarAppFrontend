import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

// Mock the jwt-decode library
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn()
}));

// Mock axios
jest.mock('axios', () => {
  const mockAxios = {
    interceptors: {
      response: {
        use: jest.fn(),
        eject: jest.fn()
      }
    }
  };
  return mockAxios;
});

// Mock the Calendar component
jest.mock('./components/Calendar', () => {
  return function MockCalendar({ onLogout }) {
    return (
      <div data-testid="calendar-component">
        <button onClick={onLogout} data-testid="logout-button">Logout</button>
      </div>
    );
  };
});

// Mock the Login component
jest.mock('./components/Login', () => {
  return function MockLogin({ onLogin }) {
    return (
      <div data-testid="login-component">
        <button onClick={onLogin} data-testid="login-button">Login</button>
      </div>
    );
  };
});

describe('App Component', () => {
  let errorHandler;
  
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        removeItem: jest.fn(),
        setItem: jest.fn()
      },
      writable: true
    });
    
    // Reset axios interceptor mock
    axios.interceptors.response.use.mockImplementation((successFn, errorFn) => {
      // Store the error handler for testing
      errorHandler = errorFn;
      return 42; // Return a mock interceptor ID
    });
  });

  test('renders login component when not logged in', () => {
    // Mock localStorage to return null for token
    localStorage.getItem.mockReturnValue(null);
    
    render(<App />);
    
    expect(screen.getByTestId('login-component')).toBeInTheDocument();
    expect(screen.queryByTestId('calendar-component')).not.toBeInTheDocument();
  });

  test('renders calendar component when logged in with valid token', () => {
    // Mock localStorage to return a token
    localStorage.getItem.mockReturnValue('valid-token');
    
    // Mock jwt-decode to return a future expiry time
    jwtDecode.mockReturnValue({ exp: Date.now() / 1000 + 3600 }); // Token expires in 1 hour
    
    render(<App />);
    
    expect(screen.getByTestId('calendar-component')).toBeInTheDocument();
    expect(screen.queryByTestId('login-component')).not.toBeInTheDocument();
  });

  test('logs out when token is expired', () => {
    // Mock localStorage to return a token
    localStorage.getItem.mockReturnValue('expired-token');
    
    // Mock jwt-decode to return an expired token
    jwtDecode.mockReturnValue({ exp: Date.now() / 1000 - 3600 }); // Token expired 1 hour ago
    
    render(<App />);
    
    // Should show login screen
    expect(screen.getByTestId('login-component')).toBeInTheDocument();
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });

  test('logs out when token is invalid', () => {
    // Mock localStorage to return a token
    localStorage.getItem.mockReturnValue('invalid-token');
    
    // Mock jwt-decode to throw an error
    jwtDecode.mockImplementation(() => {
      throw new Error('Invalid token');
    });
    
    render(<App />);
    
    // Should show login screen
    expect(screen.getByTestId('login-component')).toBeInTheDocument();
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });

  test('switches to calendar when login is successful', () => {
    // Mock localStorage to return null for token initially
    localStorage.getItem.mockReturnValue(null);
    
    render(<App />);
    
    // Initially shows login
    expect(screen.getByTestId('login-component')).toBeInTheDocument();
    
    // Click login button
    act(() => {
      screen.getByTestId('login-button').click();
    });
    
    // Should now show calendar
    expect(screen.getByTestId('calendar-component')).toBeInTheDocument();
  });

  test('switches to login when logout is clicked', () => {
    // Mock localStorage to return a token
    localStorage.getItem.mockReturnValue('valid-token');
    
    // Mock jwt-decode to return a future expiry time
    jwtDecode.mockReturnValue({ exp: Date.now() / 1000 + 3600 }); // Token expires in 1 hour
    
    render(<App />);
    
    // Initially shows calendar
    expect(screen.getByTestId('calendar-component')).toBeInTheDocument();
    
    // Click logout button
    act(() => {
      screen.getByTestId('logout-button').click();
    });
    
    // Should now show login
    expect(screen.getByTestId('login-component')).toBeInTheDocument();
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });

  test('logs out when API returns 401 unauthorized', async () => {
    // Mock localStorage to return a token
    localStorage.getItem.mockReturnValue('valid-token');
    
    // Mock jwt-decode to return a future expiry time
    jwtDecode.mockReturnValue({ exp: Date.now() / 1000 + 3600 }); // Token expires in 1 hour
    
    render(<App />);
    
    // Initially shows calendar
    expect(screen.getByTestId('calendar-component')).toBeInTheDocument();
    
    // Simulate a 401 response from API
    // We need to wrap this in act and use try/catch because the error handler will reject the promise
    await act(async () => {
      try {
        await errorHandler({ response: { status: 401 } });
      } catch (error) {
        // Expected - the error handler rejects the promise
      }
    });
    
    // Should now show login
    expect(screen.getByTestId('login-component')).toBeInTheDocument();
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });
});
