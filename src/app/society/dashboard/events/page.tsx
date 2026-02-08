"use client";
import { useState, useEffect } from "react";

export default function SocietyEvents() {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [events, setEvents] = useState<any[]>([]);
  const token = typeof window !== "undefined" ? localStorage.getItem("access") : null;

  useEffect(() => {
    if (token) {
      fetch("/api/events", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        //eslint-disable-next-line
        .then(data => setEvents(data.events.filter((e: any) => e.society?.createdBy === "currentUserId"))); // refine logic
    }
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Your Events</h1>
      <div className="grid gap-4">
        {events.map((e) => (
          <div key={e._id} className="border p-4 rounded">
            <h2 className="font-semibold">{e.title}</h2>
            <p>{new Date(e.startDate).toLocaleString()}</p>
            <a href={`/dashboard/society/events/${e._id}`} className="text-blue-600 underline">Edit</a>
          </div>
        ))}
      </div>
    </div>
  );
}
