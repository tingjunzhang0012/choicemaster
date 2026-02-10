
export enum DecisionMode {
  STANDARD = 'Standard',
  AI_WEIGHTED = 'AI_Weighted',
  COMMITMENT = 'Commitment'
}

export interface Option {
  id: string;
  label: string;
  weight: number;
  imageUrl?: string;
  vetoCount?: number; // For multiplayer veto mode
}

export interface DecisionState {
  id: string;
  title: string;
  options: Option[];
  mode: DecisionMode;
  result?: Option;
  timestamp: number;
  location?: { lat: number; lng: number };
}

export interface TeamSession {
  roomId: string;
  isHost: boolean;
  participants: string[];
  options: Option[];
  status: 'setup' | 'voting' | 'result';
}

export type Page = 'home' | 'config' | 'process' | 'result' | 'journal' | 'profile' | 'lab' | 'team-decision';
