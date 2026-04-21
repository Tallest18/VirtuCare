"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  Globe,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Doctor, TimeSlot } from "@/types";
import { AVATAR_COLORS, SPECIALTY_COLORS } from "@/lib/doctors";
import {
  addAppointment,
  generateId,
  getMinDate,
  getMaxDate,
  isSlotBooked,
  formatDate,
} from "@/lib/appointments";

interface Props {
  doctor: Doctor;
}

type Step = "select" | "confirm" | "success";

export default function BookingClient({ doctor }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("select");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (selectedDate) {
      const booked = new Set<string>();
      doctor.availableSlots.forEach((slot) => {
        if (isSlotBooked(doctor.id, selectedDate, slot.id)) {
          booked.add(slot.id);
        }
      });
      setBookedSlots(booked);
      setSelectedSlot(null);
    }
  }, [selectedDate, doctor.id, doctor.availableSlots]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!selectedDate) errs.date = "Please select a date";
    if (!selectedSlot) errs.slot = "Please select a time slot";
    if (!reason.trim()) errs.reason = "Please describe your reason for visit";
    else if (reason.trim().length < 10)
      errs.reason = "Please provide more detail (at least 10 characters)";
    return errs;
  };

  const handleContinue = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep("confirm");
  };

  const handleConfirm = () => {
    if (!selectedSlot) return;
    addAppointment({
      id: generateId(),
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      doctorAvatar: doctor.avatar,
      date: selectedDate,
      timeSlot: selectedSlot,
      reason: reason.trim(),
      status: "upcoming",
      bookedAt: new Date().toISOString(),
    });
    setStep("success");
  };

  if (step === "success") {
    return (
      <div className="page-enter min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-teal-600" />
          </div>
          <h1 className="font-serif text-3xl text-slate-900 mb-2">
            Appointment Booked!
          </h1>
          <p className="text-slate-500 mb-2">
            Your appointment with{" "}
            <span className="font-medium text-slate-700">{doctor.name}</span> is
            confirmed.
          </p>
          <p className="text-slate-500 mb-8">
            {selectedDate && formatDate(selectedDate)} at {selectedSlot?.time}{" "}
            {selectedSlot?.period}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/appointments"
              className="bg-teal-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-teal-700 transition-colors"
            >
              View My Appointments
            </Link>
            <Link
              href="/doctors"
              className="bg-slate-100 text-slate-700 font-medium px-6 py-3 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Find Another Doctor
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link
        href="/doctors"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to doctors
      </Link>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Doctor info sidebar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sticky top-24">
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${AVATAR_COLORS[doctor.id]} flex items-center justify-center text-white font-bold text-lg mb-4`}
            >
              {doctor.avatar}
            </div>
            <h1 className="font-semibold text-xl text-slate-900 mb-1">
              {doctor.name}
            </h1>
            <span
              className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full border mb-3 ${
                SPECIALTY_COLORS[doctor.specialty] ||
                "bg-slate-50 text-slate-600 border-slate-200"
              }`}
            >
              {doctor.specialty}
            </span>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              {doctor.bio}
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0" />
                <span className="font-medium text-slate-700">
                  {doctor.rating}
                </span>
                <span className="text-slate-400">
                  · {doctor.reviewCount} reviews
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Clock className="w-4 h-4 flex-shrink-0 text-slate-400" />
                {doctor.experience} years experience
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Globe className="w-4 h-4 flex-shrink-0 text-slate-400" />
                {doctor.languages.join(", ")}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm">Consultation fee</span>
                <span className="font-bold text-slate-900 text-lg">
                  ${doctor.consultationFee}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking form */}
        <div className="lg:col-span-3">
          {step === "select" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="font-serif text-2xl text-slate-900 mb-6">
                Book an Appointment
              </h2>

              {/* Date */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={getMinDate()}
                  max={getMaxDate()}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setErrors((p) => ({ ...p, date: "" }));
                  }}
                  className={`w-full px-4 py-3 rounded-xl border text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                    errors.date
                      ? "border-rose-300 bg-rose-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                />
                {errors.date && (
                  <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.date}
                  </p>
                )}
              </div>

              {/* Time slots */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Time Slot <span className="text-rose-500">*</span>
                </label>
                {!selectedDate ? (
                  <p className="text-sm text-slate-400 italic">
                    Please select a date first to see available slots.
                  </p>
                ) : (
                  <>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {doctor.availableSlots.map((slot) => {
                        const booked = bookedSlots.has(slot.id);
                        const selected = selectedSlot?.id === slot.id;
                        return (
                          <button
                            key={slot.id}
                            disabled={booked}
                            onClick={() => {
                              setSelectedSlot(slot);
                              setErrors((p) => ({ ...p, slot: "" }));
                            }}
                            className={`py-2.5 px-3 text-sm rounded-xl border font-medium transition-all duration-150 ${
                              booked
                                ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed line-through"
                                : selected
                                ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                                : "bg-white text-slate-700 border-slate-200 hover:border-teal-400 hover:text-teal-700"
                            }`}
                          >
                            {slot.time} {slot.period}
                            {booked && (
                              <span className="block text-xs font-normal mt-0.5">
                                Booked
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {errors.slot && (
                      <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.slot}
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Reason */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Reason for Visit <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    setErrors((p) => ({ ...p, reason: "" }));
                  }}
                  placeholder="Briefly describe your symptoms or reason for the appointment..."
                  className={`w-full px-4 py-3 rounded-xl border text-slate-900 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors placeholder:text-slate-400 ${
                    errors.reason
                      ? "border-rose-300 bg-rose-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.reason ? (
                    <p className="text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.reason}
                    </p>
                  ) : (
                    <span />
                  )}
                  <span className="text-xs text-slate-400">
                    {reason.length} chars
                  </span>
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="w-full bg-teal-600 text-white font-semibold py-3.5 rounded-xl hover:bg-teal-700 active:scale-[0.99] transition-all"
              >
                Review Appointment
              </button>
            </div>
          )}

          {step === "confirm" && selectedSlot && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="font-serif text-2xl text-slate-900 mb-6">
                Confirm Appointment
              </h2>

              <div className="bg-slate-50 rounded-xl p-4 mb-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Doctor</span>
                  <span className="font-medium text-slate-900">
                    {doctor.name}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Specialty</span>
                  <span className="font-medium text-slate-900">
                    {doctor.specialty}
                  </span>
                </div>
                <div className="h-px bg-slate-200" />
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Date</span>
                  <span className="font-medium text-slate-900">
                    {formatDate(selectedDate)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Time</span>
                  <span className="font-medium text-slate-900">
                    {selectedSlot.time} {selectedSlot.period}
                  </span>
                </div>
                <div className="h-px bg-slate-200" />
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Reason</span>
                  <span className="font-medium text-slate-900 text-right max-w-[60%]">
                    {reason}
                  </span>
                </div>
                <div className="h-px bg-slate-200" />
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Consultation Fee</span>
                  <span className="font-bold text-teal-700">
                    ${doctor.consultationFee}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("select")}
                  className="flex-1 bg-slate-100 text-slate-700 font-medium py-3.5 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 bg-teal-600 text-white font-semibold py-3.5 rounded-xl hover:bg-teal-700 active:scale-[0.99] transition-all"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
