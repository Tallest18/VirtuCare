export interface TimeSlot {
  id: string;
  time: string;
  period: "AM" | "PM";
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  rating: number;
  reviewCount: number;
  experience: number;
  avatar: string;
  availableSlots: TimeSlot[];
  consultationFee: number;
  languages: string[];
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  date: string;
  timeSlot: TimeSlot;
  reason: string;
  status: "upcoming" | "cancelled";
  bookedAt: string;
}
