import { Appointment } from "@/types";

const STORAGE_KEY = "virtucare_appointments";

export const getAppointments = (): Appointment[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveAppointments = (appointments: Appointment[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
};

export const addAppointment = (appointment: Appointment): void => {
  const existing = getAppointments();
  saveAppointments([...existing, appointment]);
};

export const cancelAppointment = (id: string): void => {
  const existing = getAppointments();
  const updated = existing.map((a) =>
    a.id === id ? { ...a, status: "cancelled" as const } : a
  );
  saveAppointments(updated);
};

export const deleteAppointment = (id: string): void => {
  const existing = getAppointments();
  saveAppointments(existing.filter((a) => a.id !== id));
};

export const isSlotBooked = (
  doctorId: string,
  date: string,
  slotId: string
): boolean => {
  const appointments = getAppointments();
  return appointments.some(
    (a) =>
      a.doctorId === doctorId &&
      a.date === date &&
      a.timeSlot.id === slotId &&
      a.status !== "cancelled"
  );
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatShortDate = (dateStr: string): string => {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const generateId = (): string =>
  `apt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const getMinDate = (): string => {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  return today.toISOString().split("T")[0];
};

export const getMaxDate = (): string => {
  const date = new Date();
  date.setMonth(date.getMonth() + 3);
  return date.toISOString().split("T")[0];
};
