export interface TokenTransaction {
  id: string;
  title: string;
  amount: number;
  type: 'earned' | 'spent';
  category: 'care' | 'streak' | 'learning' | 'product' | 'badge' | 'bonus';
  date: string;
  icon: string;
}

export interface RewardProduct {
  id: string;
  name: string;
  category: 'pads' | 'reusable' | 'cups' | 'underwear' | 'liners' | 'kits';
  categoryName: string;
  description: string;
  badge: string;
  priceInRupees: number;
  tokenPrice: number;
  rating: number;
  reviewCount: number;
  image: string;
  ecoScore: string;
  features: string[];
  isDemo?: boolean;
}

export interface CareTask {
  id: 'breathe' | 'hydrate' | 'checkin' | 'learn';
  title: string;
  subtitle: string;
  hindiTitle: string;
  hindiSubtitle: string;
  tokens: number;
  icon: string;
  completed: boolean;
}

export interface UserTokenState {
  tokens: number;
  streak: number;
  lastActiveDate: string;
  earnedToday: number;
  earnedBreakdown: {
    dailyCare: number;
    streak: number;
    learning: number;
  };
  spentTotal: number;
  transactions: TokenTransaction[];
  completedTasksToday: string[];
}
