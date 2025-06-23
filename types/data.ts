export interface Expense {
  id: string;
  amount: number;
  category: string;
  notes: string;
  date: string;
  isRecurring: boolean;
}

export interface CheckIn {
  id: string;
  date: string;
  type: 'morning' | 'evening';
  questions: {
    [key: string]: boolean;
  };
  completed: boolean;
}

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalCheckIns: number;
  badges: Badge[];
  weeklyGoal: number;
  lastCheckInDate: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  type: 'streak' | 'spending' | 'consistency';
}

export interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  nextDue: string;
  isActive: boolean;
}