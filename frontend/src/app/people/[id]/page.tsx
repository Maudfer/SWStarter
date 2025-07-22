import { getPerson } from '../../../lib/api';
import PersonCard from '../../../components/PersonCard';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function PersonPage({ params }: any) {
  const person = await getPerson(params.id)
  if (!person) return <div>Not found</div>
  return <PersonCard person={person} />
}
