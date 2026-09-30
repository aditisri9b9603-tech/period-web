export interface Affirmation {
  id: string;
  text: string;
  hindiText: string;
  author: string;
  tags: string[];
}

export type MoodType = 'happy' | 'calm' | 'emotional' | 'tired' | 'irritated' | 'energetic';

export interface MoodChoice {
  id: MoodType;
  emoji: string;
  label: string;
  hindiLabel: string;
  response: string;
  hindiResponse: string;
  actionTitle: string;
  actionDesc: string;
  actionIcon: string;
}

export interface MemoryCard {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface WheelItem {
  id: string;
  label: string;
  hindiLabel: string;
  icon: string;
  description: string;
  tokens: number;
  color: string;
}

export interface MythFactItem {
  id: string;
  statement: string;
  hindiStatement: string;
  isMyth: boolean;
  explanation: string;
  hindiExplanation: string;
  reference: string;
}

export interface DailyPlayChallenge {
  id: string;
  title: string;
  hindiTitle: string;
  description: string;
  tokens: number;
  icon: string;
}
