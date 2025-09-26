// src/api/appointments.test.js
import axiosInstance, {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "./appointments";
import AxiosMockAdapter from "axios-mock-adapter";

describe("Appointments API", () => {
  let mock;

  beforeEach(() => {
    mock = new AxiosMockAdapter(axiosInstance);
  });

  afterEach(() => {
    mock.restore();
  });

  test("getAppointments returns data", async () => {
    const data = [{ id: 1, title: "Meeting" }];
    mock.onGet("/appointments").reply(200, data);

    const result = await getAppointments();
    expect(result).toEqual(data);
  });

  test("createAppointment posts data and returns result", async () => {
    const appointment = { title: "New Meeting" };
    const response = { id: 2, ...appointment };
    mock.onPost("/appointments", appointment).reply(201, response);

    const result = await createAppointment(appointment);
    expect(result).toEqual(response);
  });

  test("createAppointment throws on error", async () => {
    const appointment = { title: "Fail Meeting" };
    mock.onPost("/appointments", appointment).reply(400);

    await expect(createAppointment(appointment)).rejects.toThrow();
  });

  test("updateAppointment puts data and returns result", async () => {
    const appointment = { title: "Updated Meeting" };
    const response = { id: 1, ...appointment };
    mock.onPut("/appointments/1", appointment).reply(200, response);

    const result = await updateAppointment(1, appointment);
    expect(result).toEqual(response);
  });

  test("updateAppointment throws on error", async () => {
    const appointment = { title: "Fail Update" };
    mock.onPut("/appointments/99", appointment).reply(404);

    await expect(updateAppointment(99, appointment)).rejects.toThrow();
  });

  test("deleteAppointment deletes and returns result", async () => {
    mock.onDelete("/appointments/1").reply(200, { success: true });

    const result = await deleteAppointment(1);
    expect(result).toEqual({ success: true });
  });
});
