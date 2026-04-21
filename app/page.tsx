import Link from "next/link";
import { ArrowRight, Shield, Clock, Star, Video } from "lucide-react";
import { DOCTORS, SPECIALTY_COLORS, AVATAR_COLORS } from "@/lib/doctors";

const features = [
  {
    icon: Video,
    title: "Virtual Consultations",
    desc: "Connect with doctors from the comfort of your home via video, phone, or chat.",
  },
  {
    icon: Clock,
    title: "Same-Day Bookings",
    desc: "Find available slots and book appointments instantly without any wait time.",
  },
  {
    icon: Shield,
    title: "Verified Specialists",
    desc: "Every doctor is board-certified and thoroughly vetted for your peace of mind.",
  },
];

export default function HomePage() {
  return (
    <div className="page-enter">
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white text-sm font-medium px-3 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
              Doctors available now
            </div>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-tight mb-6">
              Healthcare that comes{" "}
              <em className="not-italic text-emerald-200">to you</em>
            </h1>
            <p className="text-lg text-teal-100 mb-8 leading-relaxed max-w-xl">
              Connect with verified specialists in minutes. Book, manage, and attend virtual appointments — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/doctors"
                className="inline-flex items-center justify-center gap-2 bg-white text-teal-700 font-semibold px-6 py-3.5 rounded-xl hover:bg-teal-50 transition-colors shadow-lg"
              >
                Find a Doctor <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/appointments"
                className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-medium px-6 py-3.5 rounded-xl hover:bg-white/20 transition-colors"
              >
                My Appointments
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-10 pt-10 border-t border-white/20">
              <div><p className="text-2xl font-bold">6+</p><p className="text-teal-200 text-sm">Specialties</p></div>
              <div className="w-px h-8 bg-white/20" />
              <div><p className="text-2xl font-bold">1,700+</p><p className="text-teal-200 text-sm">Patient reviews</p></div>
              <div className="w-px h-8 bg-white/20" />
              <div><p className="text-2xl font-bold">4.8★</p><p className="text-teal-200 text-sm">Avg. rating</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-teal-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-serif text-3xl text-slate-900 mb-1">Our Specialists</h2>
            <p className="text-slate-500">Board-certified doctors ready to see you</p>
          </div>
          <Link href="/doctors" className="hidden sm:flex items-center gap-1.5 text-teal-600 font-medium text-sm hover:text-teal-700 transition-colors">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DOCTORS.slice(0, 3).map((doctor) => (
            <Link key={doctor.id} href={`/doctors/${doctor.id}`} className="doctor-card bg-white rounded-2xl p-5 border border-slate-200 block">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${AVATAR_COLORS[doctor.id]} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
                  {doctor.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">{doctor.name}</h3>
                  <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full border mt-1 ${SPECIALTY_COLORS[doctor.specialty] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
                    {doctor.specialty}
                  </span>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-sm text-slate-700 font-medium">{doctor.rating}</span>
                    <span className="text-xs text-slate-400">({doctor.reviewCount})</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm text-slate-500">{doctor.availableSlots.length} slots today</span>
                <span className="text-sm font-semibold text-teal-700">${doctor.consultationFee}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
