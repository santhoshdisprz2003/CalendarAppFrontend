import axios from 'axios';

const API_URL = 'http://localhost:5000/api/appointments';

export const getAppointments = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createAppointment = async (appointment) => {
  try {
    const response = await axios.post(API_URL, appointment);
    return response.data;
  } catch (err) {
    // bubble conflict and other errors to caller
    throw err;
  }
};

export const updateAppointment = async (id, appointment) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, appointment);
    return response.data;
  } catch (err) {
    // bubble conflict and other errors to caller
    throw err;
  }
};

export const deleteAppointment = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
