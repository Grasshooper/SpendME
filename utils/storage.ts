import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense, CheckIn, UserStats, RecurringExpense } from '@/types/data';

const STORAGE_KEYS = {
  EXPENSES: 'expenses',
  CHECK_INS: 'checkIns',
  USER_STATS: 'userStats',
  RECURRING_EXPENSES: 'recurringExpenses',
};

export const StorageService = {
  // Expenses
  async getExpenses(): Promise<Expense[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.EXPENSES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting expenses:', error);
      return [];
    }
  },

  async saveExpense(expense: Expense): Promise<void> {
    try {
      const expenses = await this.getExpenses();
      expenses.push(expense);
      await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  },

  async updateExpense(updatedExpense: Expense): Promise<void> {
    try {
      const expenses = await this.getExpenses();
      const index = expenses.findIndex(e => e.id === updatedExpense.id);
      if (index !== -1) {
        expenses[index] = updatedExpense;
        await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
      }
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  },

  async deleteExpense(expenseId: string): Promise<void> {
    try {
      const expenses = await this.getExpenses();
      const filteredExpenses = expenses.filter(e => e.id !== expenseId);
      await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(filteredExpenses));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  },

  // Check-ins
  async getCheckIns(): Promise<CheckIn[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CHECK_INS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting check-ins:', error);
      return [];
    }
  },

  async saveCheckIn(checkIn: CheckIn): Promise<void> {
    try {
      const checkIns = await this.getCheckIns();
      const existingIndex = checkIns.findIndex(
        c => c.date === checkIn.date && c.type === checkIn.type
      );
      
      if (existingIndex !== -1) {
        checkIns[existingIndex] = checkIn;
      } else {
        checkIns.push(checkIn);
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(checkIns));
    } catch (error) {
      console.error('Error saving check-in:', error);
    }
  },

  // User Stats
  async getUserStats(): Promise<UserStats> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_STATS);
      return data ? JSON.parse(data) : {
        currentStreak: 0,
        longestStreak: 0,
        totalCheckIns: 0,
        badges: [],
        weeklyGoal: 0,
        lastCheckInDate: '',
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        currentStreak: 0,
        longestStreak: 0,
        totalCheckIns: 0,
        badges: [],
        weeklyGoal: 0,
        lastCheckInDate: '',
      };
    }
  },

  async saveUserStats(stats: UserStats): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving user stats:', error);
    }
  },

  // Recurring Expenses
  async getRecurringExpenses(): Promise<RecurringExpense[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.RECURRING_EXPENSES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting recurring expenses:', error);
      return [];
    }
  },

  async saveRecurringExpense(expense: RecurringExpense): Promise<void> {
    try {
      const expenses = await this.getRecurringExpenses();
      expenses.push(expense);
      await AsyncStorage.setItem(STORAGE_KEYS.RECURRING_EXPENSES, JSON.stringify(expenses));
    } catch (error) {
      console.error('Error saving recurring expense:', error);
    }
  },
};