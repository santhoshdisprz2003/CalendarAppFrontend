// 1️⃣ MOCK axios BEFORE importing anything else
jest.mock("axios", () => ({
  post: jest.fn(),
}));

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./Login";

describe("Login Component", () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("renders login form by default", () => {
    render(<Login onLogin={mockOnLogin} />);

    // Heading
    expect(screen.getByRole("heading", { name: /Login/i })).toBeInTheDocument();

    // Inputs
    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();

    // Submit button
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  test("allows user to type username and password", async () => {
    render(<Login onLogin={mockOnLogin} />);

    const usernameInput = screen.getByPlaceholderText(/Username/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);

    await userEvent.type(usernameInput, "testuser");
    await userEvent.type(passwordInput, "mypassword");

    expect(usernameInput).toHaveValue("testuser");
    expect(passwordInput).toHaveValue("mypassword");
  });

  test("submits login and calls onLogin on success", async () => {
    const axios = require("axios");
    axios.post.mockResolvedValueOnce({ data: { token: "fake-jwt-token" } });

    render(<Login onLogin={mockOnLogin} />);

    await userEvent.type(screen.getByPlaceholderText(/Username/i), "testuser");
    await userEvent.type(screen.getByPlaceholderText(/Password/i), "mypassword");

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("fake-jwt-token");
      expect(mockOnLogin).toHaveBeenCalled();
    });
  });

  test("shows error message when login fails", async () => {
    const axios = require("axios");
    axios.post.mockRejectedValueOnce({
      response: { data: { message: "Invalid credentials" } },
    });

    render(<Login onLogin={mockOnLogin} />);

    await userEvent.type(screen.getByPlaceholderText(/Username/i), "wronguser");
    await userEvent.type(screen.getByPlaceholderText(/Password/i), "wrongpass");

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    expect(await screen.findByText(/Invalid credentials/i)).toBeInTheDocument();
  });

  test("toggles to register form", () => {
    render(<Login onLogin={mockOnLogin} />);

    fireEvent.click(screen.getByText(/Register/i));

    // Heading
    expect(screen.getByRole("heading", { name: /Register/i })).toBeInTheDocument();

    // Submit button
    expect(screen.getByRole("button", { name: /Register/i })).toBeInTheDocument();
  });
});
