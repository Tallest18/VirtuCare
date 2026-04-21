import { notFound } from "next/navigation";
import { getDoctorById } from "@/lib/doctors";
import BookingClient from "@/components/doctors/BookingClient";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props) {
  const doctor = getDoctorById(params.id);
  if (!doctor) return { title: "Doctor Not Found — VirtuCare" };
  return { title: `${doctor.name} — VirtuCare` };
}

export default function DoctorPage({ params }: Props) {
  const doctor = getDoctorById(params.id);
  if (!doctor) notFound();

  return <BookingClient doctor={doctor} />;
}
