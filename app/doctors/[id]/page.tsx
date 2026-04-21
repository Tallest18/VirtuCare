import { notFound } from "next/navigation";
import { getDoctorById } from "@/lib/doctors";
import BookingClient from "@/components/doctors/BookingClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const doctor = getDoctorById(id);
  if (!doctor) return { title: "Doctor Not Found — VirtuCare" };
  return { title: `${doctor.name} — VirtuCare` };
}

export default async function DoctorPage({ params }: Props) {
  const { id } = await params;
  const doctor = getDoctorById(id);
  if (!doctor) notFound();

  return <BookingClient doctor={doctor} />;
}