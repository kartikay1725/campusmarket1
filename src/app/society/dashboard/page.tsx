"use client";
import { useState, useEffect } from "react";

type Society = {
  name: string;
  slug: string;
  tagline?: string;
};

export default function SocietyDashboard() {
  const [society, setSociety] = useState<Society | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      setError("Not signed in.");
      return;
    }
    fetch("/api/society/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 403) throw new Error("Not a society account");
        return res.json();
      })
      .then((data) => setSociety(data.society))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!society) return <p className="p-6">Loading society info…</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Manage {society.name}</h1>
      {/* forms, events, ads later */}
    </div>
  );
}
