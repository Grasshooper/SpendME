import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Target, Edit3, Save, X, TrendingUp } from 'lucide-react-native';
import BadgeCard from '@/components/BadgeCard';
import { StorageService } from '@/utils/storage';
import { DateUtils } from '@/utils/dateUtils';
import { UserStats, Expense } from '@/types/data';
import GameGradientBackground from '@/components/GameGradientBackground';
import FloatingElements from '@/components/FloatingElements';
import BounceIn from '@/components/BounceIn';
import SlideUp from '@/components/SlideUp';
import PulseRing from '@/components/PulseRing';

export default function ProgressScreen() {
  const [userStats, setUserStats] = useState<UserStats>({
    currentStreak: 0,
    longestStreak: 0,
    totalCheckIns: 0,
    badges: [],
    weeklyGoal: 0,
    lastCheckInDate: '',
  });
  const [weeklyExpenses, setWeeklyExpenses] = useState<Expense[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const stats = await StorageService.getUserStats();
    const expenses = await StorageService.getExpenses();
    
    // Filter expenses for current week
    const weekStart = DateUtils.getWeekStart();
    const weekEnd = DateUtils.getWeekEnd();
    const weeklyData = expenses.filter(e => {
      const expenseDate = new Date(e.date);
      return expenseDate >= weekStart && expenseDate <= weekEnd;
    });

    setUserStats(stats);
    setWeeklyExpenses(weeklyData);
    setGoalInput(stats.weeklyGoal.toString());
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleGoalSave = async () => {
    const newGoal = parseFloat(goalInput);
    if (isNaN(newGoal) || newGoal < 0) {
      Alert.alert('Invalid Goal', 'Please enter a valid positive number.');
      return;
    }

    const updatedStats = { ...userStats, weeklyGoal: newGoal };
    await StorageService.saveUserStats(updatedStats);
    setUserStats(updatedStats);
    setEditingGoal(false);
  };

  const handleGoalCancel = () => {
    setGoalInput(userStats.weeklyGoal.toString());
    setEditingGoal(false);
  };

  const getTotalWeeklySpent = () => {
    return weeklyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getGoalProgress = () => {
    if (userStats.weeklyGoal === 0) return 0;
    return Math.min(getTotalWeeklySpent() / userStats.weeklyGoal, 1);
  };

  const getTopCategories = () => {
    const categoryTotals = weeklyExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as { [key: string]: number });

    return Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
  };

  const weeklySpent = getTotalWeeklySpent();
  const goalProgress = getGoalProgress();
  const isOverBudget = userStats.weeklyGoal > 0 && weeklySpent > userStats.weeklyGoal;

  return (
    <GameGradientBackground type="default">
      <FloatingElements />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <SlideUp>
            <View style={styles.header}>
              <Text style={styles.title}>Progress</Text>
            </View>
          </SlideUp>

          <BounceIn>
            <View style={styles.progressSummary}>
              <TrendingUp size={24} color="#8B5CF6" />
              <Text style={styles.progressTitle}>Weekly Progress</Text>
            </View>
          </BounceIn>

          <SlideUp>
            <View style={styles.progressStats}>
              <View style={styles.progressStatItem}>
                <Text style={styles.progressStatNumber}>{weeklyExpenses.length}</Text>
                <Text style={styles.progressStatLabel}>Expenses This Week</Text>
              </View>
              <View style={styles.progressStatItem}>
                <Text style={styles.progressStatNumber}>{DateUtils.formatCurrency(weeklySpent)}</Text>
                <Text style={styles.progressStatLabel}>Weekly Total</Text>
              </View>
            </View>
          </SlideUp>

          <BounceIn>
            <View style={styles.goalProgress}>
              <Text style={styles.goalProgressTitle}>Weekly Goal Progress</Text>
              <View style={styles.goalProgressBar}>
                <PulseRing size={64} color={isOverBudget ? '#FF6B6B' : '#FFD700'}>
                  <Text style={styles.goalProgressText}>{Math.round(goalProgress * 100)}%</Text>
                </PulseRing>
              </View>
              <Text style={styles.goalProgressText}>
                {DateUtils.formatCurrency(weeklySpent)} / {DateUtils.formatCurrency(userStats.weeklyGoal)}
              </Text>
            </View>
          </BounceIn>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </GameGradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  goalContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  goalContainerOverBudget: {
    borderLeftColor: '#EF4444',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginLeft: 8,
  },
  editButton: {
    padding: 4,
  },
  editActions: {
    flexDirection: 'row',
  },
  saveButton: {
    padding: 4,
  },
  cancelButton: {
    padding: 4,
    marginLeft: 8,
  },
  goalAmount: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  goalInput: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#10B981',
    paddingVertical: 4,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  progressTextOver: {
    color: '#EF4444',
  },
  overBudgetText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
    marginTop: 8,
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  categoriesContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  categoriesTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  categoryRank: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
    width: 24,
  },
  categoryName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    flex: 1,
    marginLeft: 8,
  },
  categoryAmount: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  badgesContainer: {
    margin: 16,
  },
  badgesScroll: {
    paddingLeft: 8,
  },
  noBadgesContainer: {
    backgroundColor: '#FFFFFF',
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  noBadgesText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginBottom: 8,
  },
  noBadgesSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    maxWidth: 240,
  },
  bottomSpacer: {
    height: 100,
  },
  progressSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  progressStatItem: {
    alignItems: 'center',
  },
  progressStatNumber: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  progressStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  goalProgress: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  goalProgressTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  goalProgressBar: {
    height: 64,
    backgroundColor: '#E5E7EB',
    borderRadius: 32,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalProgressText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
});