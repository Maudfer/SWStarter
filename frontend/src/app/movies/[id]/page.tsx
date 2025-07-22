import { getMovie } from '../../../lib/api';
import MovieCard from '../../../components/MovieCard';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function MoviePage({ params }: any) {
  const { id } = await params
  const movie = await getMovie(id)

  if (!movie) return <div>Not found</div>
  return <MovieCard movie={movie} />
}
