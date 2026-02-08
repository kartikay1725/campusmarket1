import Image from "next/image";
import { notFound } from "next/navigation";
import { getEvents } from "@/lib/events";

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const events = await getEvents({ slug });
  const event = events[0];
  if (!event) return notFound();

  return (
    <div className="container mx-auto py-6">
      {event.bannerUrl && (
        <div className="relative w-full h-48 mb-4">
          <Image
            alt="banner"
            src={event.bannerUrl}
            fill
            className="object-cover rounded-xl"
          />
        </div>
      )}
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
