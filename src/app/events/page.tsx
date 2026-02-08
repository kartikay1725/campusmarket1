import Image from "next/image";

export default async function EventsFeed() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events`, {
    next: { revalidate: 60 }
  });
  const { events } = await res.json();

  return (
    <div className="container mx-auto py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {events.map((event: any) => (
        <a key={event._id} href={`/events/${event.slug}`} className="border rounded-xl p-4 hover:shadow">
          {event.bannerUrl && <Image alt="banner" src={event.bannerUrl} className="w-full h-32 object-cover rounded" />}
          <h2 className="font-semibold text-lg mt-2">{event.title}</h2>
          <p className="text-sm text-muted-foreground">{event.society?.name}</p>
          <p className="text-xs text-gray-500">{new Date(event.startDate).toLocaleString()}</p>
        </a>
      ))}
    </div>
  );
}
