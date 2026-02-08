import Image from "next/image";
import { getEvents } from "@/lib/events";

interface Event {
  _id: { toString: () => string };
  slug: string;
  bannerUrl?: string;
  title: string;
  society?: { name: string };
  startDate: string;
}

export default async function EventsFeed() {
  const events = await getEvents() as unknown as Event[];

  return (
    <div className="container mx-auto py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <a key={event._id.toString()} href={`/events/${event.slug}`} className="border rounded-xl p-4 hover:shadow">
          {event.bannerUrl && (
            <div className="relative w-full h-32 mb-2">
              <Image
                alt="banner"
                src={event.bannerUrl}
                fill
                className="object-cover rounded"
              />
            </div>
          )}
          <h2 className="font-semibold text-lg mt-2">{event.title}</h2>
          <p className="text-sm text-muted-foreground">{event.society?.name}</p>
          <p className="text-xs text-gray-500">{new Date(event.startDate).toLocaleString()}</p>
        </a>
      ))}
    </div>
  );
}
