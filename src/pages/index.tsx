import Link from 'next/link';
import tournamentsData from '@data/tournaments.json';
import type { Tournament } from '@/types/tournaments';

const tournaments: Tournament[] = tournamentsData;

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">Tetris Pickems Tournaments</h1>
      <ul className="space-y-4">
        {tournaments.map(t => (
          <li key={t.id}>
            <Link href={`/tournament/${t.id}`} className="text-blue-600 hover:underline text-xl">
              {t.name}
            </Link>
            <p className="text-sm text-gray-600">Starts: {new Date(t.startDate).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
