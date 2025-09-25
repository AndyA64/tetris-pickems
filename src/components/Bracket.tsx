import { useState, useEffect } from 'react';

type Props = {
  players: string[];  // 16 initial players for round 1
  locked: boolean;
  onSubmit: (picks: string[]) => void;
};

export default function Bracket({ players, locked, onSubmit }: Props) {
  // picks state stores the winner of each match by round and index
  // rounds: 0 = round of 16 (8 matches), 1 = quarterfinals (4 matches), etc.
  // We'll keep picks as an array of arrays for each round's winners
  const [picks, setPicks] = useState<string[][]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('userPicks');
    if (saved) setPicks(JSON.parse(saved));
    else setPicks([Array(8).fill('')]); // round 1 has 8 matches (16 players)
  }, []);

  useEffect(() => {
    if (!locked) {
      localStorage.setItem('userPicks', JSON.stringify(picks));
    }
  }, [picks, locked]);

  // helper: get players for round based on previous round picks or initial players
  const getRoundPlayers = (round: number): string[] => {
    if (round === 0) {
      // round 0: players come directly from initial players array (pairs)
      return players;
    }
    if (!picks[round - 1]) return [];
    // For rounds > 0, players come from previous round picks (winners)
    return picks[round - 1];
  };

  // number of matches per round halves each round, so rounds: 0=8,1=4,2=2,3=1 matches
  const totalRounds = 4; 

  const handlePick = (round: number, matchIndex: number, player: string) => {
    if (locked) return;

    // copy picks up to current round
    const newPicks = picks.slice(0, round + 1);

    // ensure current round picks array exists
    if (!newPicks[round]) {
      newPicks[round] = Array(Math.pow(2, totalRounds - round -1)).fill('');
    }

    // update pick for this match
    newPicks[round][matchIndex] = player;

    // Clear picks for subsequent rounds (since those depend on current round's picks)
    for (let i = round + 1; i < totalRounds; i++) {
      newPicks[i] = Array(Math.pow(2, totalRounds - i -1)).fill('');
    }

    setPicks(newPicks);
  };

  const renderRound = (round: number) => {
    const roundPlayers = getRoundPlayers(round);
    const matchesCount = roundPlayers.length / 2;

    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: matchesCount }).map((_, i) => {
          const player1 = roundPlayers[i * 2];
          const player2 = roundPlayers[i * 2 + 1];
          const selected = picks[round]?.[i];

          return (
            <div key={i} className="flex flex-col gap-1">
              <button
                onClick={() => handlePick(round, i, player1)}
                className={`p-2 border rounded ${
                  selected === player1 ? 'bg-green-300' : ''
                }`}
                disabled={locked}
              >
                {player1}
              </button>
              <button
                onClick={() => handlePick(round, i, player2)}
                className={`p-2 border rounded ${
                  selected === player2 ? 'bg-green-300' : ''
                }`}
                disabled={locked}
              >
                {player2}
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  // Final winner is the pick in the last round first match
  const finalWinner = picks[totalRounds - 1]?.[0] || 'Pick Winner';

  return (
    <div className="flex gap-8">
      {Array.from({ length: totalRounds }).map((_, i) => (
        <div key={i}>{renderRound(i)}</div>
      ))}
      <div className="flex flex-col gap-4">
        <div className="p-2 border rounded bg-blue-100">{finalWinner}</div>
        {!locked && (
          <button
            className="ml-6 p-3 bg-blue-500 text-white rounded"
            onClick={() => {
              // flatten picks array into a single array of picks for submit
              const flattened = picks.flat();
              onSubmit(flattened);
            }}
          >
            Submit Picks
          </button>
        )}
      </div>
    </div>
  );
}
