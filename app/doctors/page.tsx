import Link from "next/link";
import { Star, Clock, Globe, ArrowRight } from "lucide-react";
import { DOCTORS, SPECIALTY_COLORS, AVATAR_COLORS } from "@/lib/doctors";

export const metadata = { title: "Find Doctors — VirtuCare" };

export default function DoctorsPage() {
  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-serif text-4xl text-slate-900 mb-2">Find a Doctor</h1>
        <p className="text-slate-500 text-lg">
          Browse our network of verified specialists and book your appointment today.
        </p>
      </div>

      {/* Stats bar */}
      <div className="bg-teal-600 text-white rounded-2xl px-6 py-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">{DOCTORS.length}</span>
          </div>
          <span className="text-sm">Specialists available</span>
        </div>
        <div className="w-px h-5 bg-white/20 hidden sm:block" />
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-teal-200" />
          Instant booking, no waiting rooms
        </div>
        <div className="w-px h-5 bg-white/20 hidden sm:block" />
        <div className="flex items-center gap-2 text-sm">
          <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
          4.8 avg. patient rating
        </div>
      </div>

      {/* Doctors grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {DOCTORS.map((doctor, i) => (
          <Link
            key={doctor.id}
            href={`/doctors/${doctor.id}`}
            className={`doctor-card bg-white rounded-2xl border border-slate-200 overflow-hidden block group animate-fade-in-up-delay-${Math.min(i + 1, 6)}`}
          >
            {/* Card header */}
            <div className={`h-2 bg-gradient-to-r ${AVATAR_COLORS[doctor.id]}`} />
            <div className="p-5">
              <div className="flex items-start gap-4 mb-4">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${AVATAR_COLORS[doctor.id]} flex items-center justify-center text-white font-bold text-base flex-shrink-0`}
                >
                  {doctor.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-slate-900 leading-tight mb-1 group-hover:text-teal-700 transition-colors">
                    {doctor.name}
                  </h2>
                  <span
                    className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full border ${
                      SPECIALTY_COLORS[doctor.specialty] || "bg-slate-50 text-slate-600 border-slate-200"
                    }`}
                  >
                    {doctor.specialty}
                  </span>
                </div>
              </div>

              <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
                {doctor.bio}
              </p>

              {/* Meta */}
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-slate-700">{doctor.rating}</span>
                  <span className="text-slate-400">({doctor.reviewCount})</span>
                </div>
                <span className="text-slate-500">{doctor.experience} yrs exp.</span>
              </div>

              {/* Languages */}
              <div className="flex items-center gap-1.5 mb-4">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-500">{doctor.languages.join(", ")}</span>
              </div>

              {/* Available slots preview */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {doctor.availableSlots.slice(0, 4).map((slot) => (
                  <span
                    key={slot.id}
                    className="text-xs bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md"
                  >
                    {slot.time} {slot.period}
                  </span>
                ))}
                {doctor.availableSlots.length > 4 && (
                  <span className="text-xs text-teal-600 font-medium px-1 py-0.5">
                    +{doctor.availableSlots.length - 4} more
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-400">Consultation fee</p>
                  <p className="font-bold text-slate-900">${doctor.consultationFee}</p>
                </div>
                <span className="flex items-center gap-1.5 bg-teal-600 text-white text-sm font-medium px-4 py-2 rounded-lg group-hover:bg-teal-700 transition-colors">
                  Book <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
