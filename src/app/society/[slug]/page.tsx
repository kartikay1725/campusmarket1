import Image from "next/image";
import { notFound } from "next/navigation";

export default async function SocietyPage({ params }: { params: { slug: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/society/${params.slug}`, {
    next: { revalidate: 60 }
  });
  if (!res.ok) return notFound();
  const { society } = await res.json();

  return (
    <div className="container mx-auto py-6">
      <div className="relative">
        {society.bannerUrl && <Image alt="banner" src={society.bannerUrl} width={1000} height={500} className="w-full h-48 object-cover rounded-xl" />}
        <div className="flex items-center gap-4 mt-4">
          {society.logoUrl && <Image alt="logo" src={society.logoUrl} width={100} height={100} className="w-20 h-20 rounded-full border" />}
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
