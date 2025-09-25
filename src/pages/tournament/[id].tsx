import { useRouter } from 'next/router';
import rawTournaments from '@data/tournaments.json';
import Bracket from '../../components/Bracket';
import { useState } from 'react';
import type { Tournament } from '@/types/tournaments';

const tournaments: Tournament[] = rawTournaments;

export default function TournamentPage() {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return <p className="p-6">Loading...</p>;

  const tournamentId = Array.isArray(id) ? id[0] : id;
  const tournament = tournaments.find(t => t.id === tournamentId);

  const [submitted, setSubmitted] = useState(false);

  if (!tournament) return <p className="p-6">Tournament not found.</p>;

  const locked = new Date(tournament.startDate) < new Date();

  const handleSubmit = (picks: string[]) => {
    setSubmitted(true);
    alert('Picks submitted!');
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-2">{tournament.name}</h1>
      <p className="mb-4 text-sm text-gray-600">
        Starts: {new Date(tournament.startDate).toLocaleString()}
      </p>

      <Bracket
        players={tournament.players}
        locked={locked || submitted}
        onSubmit={handleSubmit}
      />

    </main>
  );
}
