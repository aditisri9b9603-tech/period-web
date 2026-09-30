import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TokenTransaction, UserTokenState } from '../types/tokens';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

interface TokenCelebration {
  id: number;
  amount: number;
  reason: string;
}

interface TokenContextType {
  tokens: number;
  streak: number;
  earnedToday: number;
  earnedBreakdown: {
    dailyCare: number;
    streak: number;
    learning: number;
  };
  spentTotal: number;
  transactions: TokenTransaction[];
  completedTasksToday: string[];
  earnTokens: (
    amount: number,
    reason: string,
    category: 'care' | 'streak' | 'learning' | 'product' | 'badge' | 'bonus',
    icon?: string
  ) => void;
  spendTokens: (amount: number, itemTitle: string, icon?: string) => boolean;
  completeCareTask: (taskId: string, tokens: number, taskName: string) => void;
  celebrations: TokenCelebration[];
  dismissCelebration: (id: number) => void;
}

const STORAGE_TOKEN_STATE = 'sakhi_token_state_v2';

const DEFAULT_STATE: UserTokenState = {
  tokens: 1250,
  streak: 7,
  lastActiveDate: new Date().toISOString().split('T')[0],
  earnedToday: 20,
  earnedBreakdown: {
    dailyCare: 100,
    streak: 50,
    learning: 40,
  },
  spentTotal: 500,
  completedTasksToday: [],
  transactions: [
    {
      id: 'tx_seed_1',
      title: '7 Day Care Streak Bonus 🔥',
      amount: 50,
      type: 'earned',
      category: 'streak',
      date: new Date(Date.now() - 3600000 * 2).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
      }),
      icon: '🔥',
    },
    {
      id: 'tx_seed_2',
      title: 'Morning Breathwork Pranayama 🧘‍♀️',
      amount: 10,
      type: 'earned',
      category: 'care',
      date: new Date(Date.now() - 3600000 * 5).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
      }),
      icon: '🌸',
    },
    {
      id: 'tx_seed_3',
      title: 'Redeemed Organic Cotton Pads 🌸',
      amount: 500,
      type: 'spent',
      category: 'product',
      date: new Date(Date.now() - 86400000 * 2).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
      }),
      icon: '🛍️',
    },
    {
      id: 'tx_seed_4',
      title: 'Cramp Soothing Diet Card 🥗',
      amount: 10,
      type: 'earned',
      category: 'learning',
      date: new Date(Date.now() - 86400000 * 3).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
      }),
      icon: '📚',
    },
  ],
};

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<UserTokenState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TOKEN_STATE);
      if (saved) {
        const parsed = JSON.parse(saved);
        const today = new Date().toISOString().split('T')[0];
        // Reset completedTasksToday if on a new calendar day
        if (parsed.lastActiveDate !== today) {
          return {
            ...parsed,
            lastActiveDate: today,
            earnedToday: 0,
            completedTasksToday: [],
          };
        }
        return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_STATE;
  });

  const [celebrations, setCelebrations] = useState<TokenCelebration[]>([]);

  // Persist to localStorage and sync to Firestore if user is authenticated
  const saveState = useCallback((newState: UserTokenState) => {
    setState(newState);
    try {
      localStorage.setItem(STORAGE_TOKEN_STATE, JSON.stringify(newState));
    } catch {
      // ignore
    }

    const currentUser = auth.currentUser;
    if (currentUser) {
      const userDocRef = doc(db, 'users', currentUser.uid);
      setDoc(
        userDocRef,
        {
          tokens: newState.tokens,
          streak: newState.streak,
          lastActiveDate: newState.lastActiveDate,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      ).catch((err) => {
        console.warn('Firestore token sync notice (offline mode fallback active):', err.message);
      });
    }
  }, []);

  // Listen to Auth changes and restore synced tokens
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data();
            if (typeof data.tokens === 'number') {
              setState((prev) => ({
                ...prev,
                tokens: data.tokens,
                streak: data.streak ?? prev.streak,
              }));
            }
          }
        } catch {
          // ignore offline
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const triggerCelebration = useCallback((amount: number, reason: string) => {
    const id = Date.now() + Math.random();
    setCelebrations((prev) => [...prev, { id, amount, reason }]);
    setTimeout(() => {
      setCelebrations((prev) => prev.filter((c) => c.id !== id));
    }, 4500);
  }, []);

  const dismissCelebration = useCallback((id: number) => {
    setCelebrations((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const earnTokens = useCallback(
    (
      amount: number,
      reason: string,
      category: 'care' | 'streak' | 'learning' | 'product' | 'badge' | 'bonus',
      icon = '✨'
    ) => {
      setState((prev) => {
        const newTokens = prev.tokens + amount;
        const newEarnedToday = prev.earnedToday + amount;
        const newEarnedBreakdown = { ...prev.earnedBreakdown };

        if (category === 'care') newEarnedBreakdown.dailyCare += amount;
        else if (category === 'streak') newEarnedBreakdown.streak += amount;
        else if (category === 'learning') newEarnedBreakdown.learning += amount;

        const newTx: TokenTransaction = {
          id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          title: reason,
          amount,
          type: 'earned',
          category,
          date: new Date().toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          icon,
        };

        const updated: UserTokenState = {
          ...prev,
          tokens: newTokens,
          earnedToday: newEarnedToday,
          earnedBreakdown: newEarnedBreakdown,
          transactions: [newTx, ...prev.transactions].slice(0, 50),
        };

        saveState(updated);
        return updated;
      });

      triggerCelebration(amount, reason);
    },
    [saveState, triggerCelebration]
  );

  const spendTokens = useCallback(
    (amount: number, itemTitle: string, icon = '🛍️'): boolean => {
      if (state.tokens < amount) {
        return false;
      }

      setState((prev) => {
        const newTokens = prev.tokens - amount;
        const newSpentTotal = prev.spentTotal + amount;

        const newTx: TokenTransaction = {
          id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          title: `Redeemed ${itemTitle}`,
          amount,
          type: 'spent',
          category: 'product',
          date: new Date().toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          icon,
        };

        const updated: UserTokenState = {
          ...prev,
          tokens: newTokens,
          spentTotal: newSpentTotal,
          transactions: [newTx, ...prev.transactions].slice(0, 50),
        };

        saveState(updated);
        return updated;
      });

      return true;
    },
    [state.tokens, saveState]
  );

  const completeCareTask = useCallback(
    (taskId: string, tokens: number, taskName: string) => {
      if (state.completedTasksToday.includes(taskId)) {
        return;
      }

      setState((prev) => {
        const newCompleted = [...prev.completedTasksToday, taskId];
        const newTokens = prev.tokens + tokens;
        const newEarnedBreakdown = {
          ...prev.earnedBreakdown,
          dailyCare: prev.earnedBreakdown.dailyCare + tokens,
        };

        const newTx: TokenTransaction = {
          id: `tx_${Date.now()}_${taskId}`,
          title: `Completed: ${taskName}`,
          amount: tokens,
          type: 'earned',
          category: 'care',
          date: new Date().toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          icon: '🌸',
        };

        const updated: UserTokenState = {
          ...prev,
          tokens: newTokens,
          earnedToday: prev.earnedToday + tokens,
          earnedBreakdown: newEarnedBreakdown,
          completedTasksToday: newCompleted,
          transactions: [newTx, ...prev.transactions].slice(0, 50),
        };

        saveState(updated);
        return updated;
      });

      triggerCelebration(tokens, taskName);
    },
    [state.completedTasksToday, saveState, triggerCelebration]
  );

  return (
    <TokenContext.Provider
      value={{
        tokens: state.tokens,
        streak: state.streak,
        earnedToday: state.earnedToday,
        earnedBreakdown: state.earnedBreakdown,
        spentTotal: state.spentTotal,
        transactions: state.transactions,
        completedTasksToday: state.completedTasksToday,
        earnTokens,
        spendTokens,
        completeCareTask,
        celebrations,
        dismissCelebration,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};

export const useTokens = () => {
  const ctx = useContext(TokenContext);
  if (!ctx) {
    throw new Error('useTokens must be used within a TokenProvider');
  }
  return ctx;
};
