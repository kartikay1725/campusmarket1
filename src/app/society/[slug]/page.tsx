import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

export default async function SocietyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/society/${slug}`, {
    next: { revalidate: 60 }
  });
  if (!res.ok) return notFound();
  const { society } = await res.json();

  return (
    <div className="container mx-auto py-6">
      <div className="relative">
        {society.bannerUrl && (
          <div className="relative w-full h-48 mb-4">
            <Image
              alt="banner"
              src={society.bannerUrl}
              fill
              className="object-cover rounded-xl"
            />
          </div>
        )}
        <div className="flex items-center gap-4 mt-4">
          {society.logoUrl && (
            <div className="relative w-20 h-20">
              <Image
                alt="logo"
                src={society.logoUrl}
                fill
                className="rounded-full border object-contain"
              />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">{society.name}</h1>
            <p className="text-muted-foreground">{society.tagline}</p>
          </div>
        </div>
      </div>

      <p className="mt-4">{society.description}</p>

      <div className="mt-6">
        {/* render socials */}
        {Object.entries(society.socials || {}).map(([key, value]) =>
          value ? <a key={key} href={value.toString()} className="mr-3 underline text-blue-600">{key}</a> : null
        )}
      </div>

      {/* TODO: event list will be pulled later */}
    </div>
  );
}
