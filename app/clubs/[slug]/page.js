import { notFound } from 'next/navigation'
import clubs from '../../../data/clubs.json'
import ClubPage from './ClubPage'

export function generateStaticParams() {
  return clubs.map(c => ({ slug: c.slug }))
}

export default function Page({ params }) {
  const club = clubs.find(c => c.slug === params.slug)
  if (!club) notFound()
  return <ClubPage club={club} />
}
