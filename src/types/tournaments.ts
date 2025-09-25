// src/types/tournaments.ts

export interface Tournament {
  id: string;
  name: string;
  startDate: string;
  players: string[];
  results: string[]; // <-- array of strings, not object
}