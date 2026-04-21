"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  Trash2,
  XCircle,
  Stethoscope,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { Appointment } from "@/types";
import {
  getAppointments,
  cancelAppointment,
  deleteAppointment,
  formatDate,
  formatShortDate,
} from "@/lib/appointments";
import { AVATAR_COLORS, SPECIALTY_COLORS } from "@/lib/doctors";

type Filter = "all" | "upcoming" | "cancelled";

export default function AppointmentsDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppointments(getAppointments());
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const refresh = () => setAppointments(getAppointments());

  const handleCancel = (id: string) => {
    cancelAppointment(id);
    refresh();
    setConfirmCancel(null);
  };

  const handleDelete = (id: string) => {
    deleteAppointment(id);
    refresh();
    setConfirmDelete(null);
  };

  const filtered = appointments.filter((a) => {
    if (filter === "upcoming") return a.status === "upcoming";
    if (filter === "cancelled") return a.status === "cancelled";
    return true;
  });

  const upcomingCount = appointments.filter((a) => a.status === "upcoming").length;

  return (
    <div className="page-enter max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-4xl text-slate-900 mb-1">
            My Appointments
          </h1>
          <p className="text-slate-500">
            {upcomingCount > 0
              ? `You have ${upcomingCount} upcoming appointment${upcomingCount !== 1 ? "s" : ""}`
              : "Manage your healthcare bookings"}
          </p>
        </div>
        <Link
          href="/doctors"
          className="inline-flex items-center gap-2 bg-teal-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-teal-700 transition-colors flex-shrink-0"
        >
          Book New <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6 w-fit">
        {(["all", "upcoming", "cancelled"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg capitalize transition-all ${
              filter === f
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {f}
            {f === "upcoming" && upcomingCount > 0 && (
              <span className="ml-1.5 bg-teal-100 text-teal-700 text-xs px-1.5 py-0.5 rounded-full">
                {upcomingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-start gap-4">
                <div className="skeleton w-12 h-12 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-40" />
                  <div className="skeleton h-3 w-24" />
                  <div className="skeleton h-3 w-56 mt-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CalendarDays className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">
            {filter === "all"
              ? "No appointments yet"
              : `No ${filter} appointments`}
          </h3>
          <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
            {filter === "all"
              ? "Book your first appointment with one of our specialist doctors."
              : `You don't have any ${filter} appointments.`}
          </p>
          {filter === "all" && (
            <Link
              href="/doctors"
              className="inline-flex items-center gap-2 bg-teal-600 text-white font-medium px-5 py-2.5 rounded-xl hover:bg-teal-700 transition-colors text-sm"
            >
              <Stethoscope className="w-4 h-4" /> Find a Doctor
            </Link>
          )}
        </div>
      )}

      {/* Appointments list */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((apt) => (
            <div
              key={apt.id}
              className={`bg-white rounded-2xl border overflow-hidden transition-all ${
                apt.status === "cancelled"
                  ? "border-slate-200 opacity-70"
                  : "border-slate-200 hover:border-teal-200 hover:shadow-sm"
              }`}
            >
              {/* Status bar */}
              <div
                className={`h-1 ${
                  apt.status === "upcoming"
                    ? `bg-gradient-to-r ${AVATAR_COLORS[apt.doctorId] || "from-teal-400 to-teal-600"}`
                    : "bg-slate-200"
                }`}
              />
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                      apt.status === "cancelled"
                        ? "bg-slate-300"
                        : `bg-gradient-to-br ${AVATAR_COLORS[apt.doctorId] || "from-teal-400 to-teal-600"}`
                    }`}
                  >
                    {apt.doctorAvatar}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-slate-900 leading-tight">
                          {apt.doctorName}
                        </h3>
                        <span
                          className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full border mt-1 ${
                            SPECIALTY_COLORS[apt.doctorSpecialty] ||
                            "bg-slate-50 text-slate-600 border-slate-200"
                          }`}
                        >
                          {apt.doctorSpecialty}
                        </span>
                      </div>
                      {/* Status badge */}
                      <span
                        className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${
                          apt.status === "upcoming"
                            ? "bg-teal-50 text-teal-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {apt.status === "upcoming" ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {apt.status === "upcoming" ? "Upcoming" : "Cancelled"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-3">
                      <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                        {formatShortDate(apt.date)}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {apt.timeSlot.time} {apt.timeSlot.period}
                      </div>
                    </div>

                    <div className="mt-2 p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-400 font-medium mb-0.5 uppercase tracking-wide">
                        Reason
                      </p>
                      <p className="text-sm text-slate-700">{apt.reason}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {apt.status === "upcoming" && (
                  <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                    {confirmCancel === apt.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">Cancel this appointment?</span>
                        <button
                          onClick={() => setConfirmCancel(null)}
                          className="text-xs text-slate-500 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          No
                        </button>
                        <button
                          onClick={() => handleCancel(apt.id)}
                          className="text-xs text-rose-600 font-medium px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                        >
                          Yes, Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmCancel(apt.id)}
                        className="flex items-center gap-1.5 text-sm text-slate-500 px-3 py-1.5 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      >
                        <XCircle className="w-4 h-4" /> Cancel
                      </button>
                    )}
                  </div>
                )}

                {apt.status === "cancelled" && (
                  <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                    {confirmDelete === apt.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">Delete this record?</span>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="text-xs text-slate-500 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          No
                        </button>
                        <button
                          onClick={() => handleDelete(apt.id)}
                          className="text-xs text-rose-600 font-medium px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                        >
                          Yes, Delete
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(apt.id)}
                        className="flex items-center gap-1.5 text-sm text-slate-500 px-3 py-1.5 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
