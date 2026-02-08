import Image from "next/image";
import { notFound } from "next/navigation";

export default async function EventPage({ params }: { params: { slug: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events?slug=${params.slug}`);
  if (!res.ok) return notFound();
  const { events } = await res.json();
  const event = events[0];
  if (!event) return notFound();

  return (
    <div className="container mx-auto py-6">
      {event.bannerUrl && <Image alt="banner" src={event.bannerUrl} className="w-full h-48 object-cover rounded-xl" />}
      <h1 className="text-3xl font-bold mt-4">{event.title}</h1>
      <p className="text-gray-600">{new Date(event.startDate).toLocaleString()}</p>
      <p className="mt-4">{event.description}</p>
      <a href={`/society/${event.society.slug}`} className="text-blue-600 underline mt-4 block">
        Hosted by {event.society.name}
      </a>
      {/* RSVP button will go here */}
    </div>
  );
}
