import axios from "axios";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // backend base URL
});

// Add token interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Get all appointments
export const getAppointments = async () => {
  const response = await axiosInstance.get("/appointments");
  return response.data;
};

// ✅ Create a new appointment
export const createAppointment = async (appointment) => {
  try {
    const response = await axiosInstance.post("/appointments", appointment);
    return response.data;
  } catch (err) {
    throw err; // bubble errors to caller
  }
};

// ✅ Update an appointment
export const updateAppointment = async (id, appointment) => {
  try {
    const response = await axiosInstance.put(`/appointments/${id}`, appointment);
    return response.data;
  } catch (err) {
    throw err;
  }
};

// ✅ Delete an appointment
export const deleteAppointment = async (id) => {
  const response = await axiosInstance.delete(`/appointments/${id}`);
  return response.data;
};

export default axiosInstance;
