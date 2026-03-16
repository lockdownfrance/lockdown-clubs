import { notFound } from 'next/navigation'
import clubs from '../../../data/clubs.json'
import ClubPage from './ClubPage'

export async function generateStaticParams() {
  return clubs.map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const club = clubs.find(c => c.slug === slug)
  if (!club) return {}
  return {
    title: `${club.nom} de ${club.ville} — LOCKDOWN FRANCE`,
  }
}

export default async function Page({ params }) {
  const { slug } = await params
  const club = clubs.find(c => c.slug === slug)
  if (!club) notFound()
  return <ClubPage club={club} />
}
