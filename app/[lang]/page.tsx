import Link from "next/link"
import { load } from "outstatic/server"

export default async function Home({
  params: { lang } = { lang: "es" },
}: {
  params?: { lang?: string };
}) {

  type Props = {lang: "es" | "en"}

  type Profiles = {
    lang: Array<{
      label: string
      value: string
    }>
    network: string
    title: string
    url: string
  }

  async function getData(lang : string) {
    const db = await load()
  
    const profiles = await db
      .find({ collection: 'profiles'}, [
        'title',
        'network',
        'url',
        'lang'
      ])
      .sort({ publishedAt: 1 })
      .toArray() as unknown as Profiles[]
  
    const profilesFiltered = profiles.filter(profile => profile.lang.some(l => l.value === lang));
  
    return {
      profilesFiltered,
    }
  }

  const { profilesFiltered } = await getData(lang || "es")
  return (
   
   <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <section className="flex flex-row flex-wrap md:flex-col gap-6 flex-shrink">
        {profilesFiltered.map((profile, i) => {
          return (
            <Link
              href={profile.url}
              key={i}
              className="flex flex-row gap-2"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="text-lg">{profile.title}</span>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
