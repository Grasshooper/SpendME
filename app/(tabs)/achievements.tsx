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
import { LinearGradient } from 'expo-linear-gradient';
import { Target, CreditCard as Edit3, Save, X, Trophy, Star } from 'lucide-react-native';
import BadgeCard from '@/components/BadgeCard';
import WeeklyGoalCard from '@/components/WeeklyGoalCard';
import { StorageService } from '@/utils/storage';
import { DateUtils } from '@/utils/dateUtils';
import { UserStats, Expense } from '@/types/data';

export default function AchievementsScreen() {
  const [userStats, setUserStats] = useState<UserStats>({
    currentStreak: 1,
    longestStreak: 1,
    totalCheckIns: 0,
    badges: [],
    weeklyGoal: 600,
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
  const isOverBudget = userStats.weeklyGoal > 0 && weeklySpent > userStats.weeklyGoal;

  return (
    <LinearGradient
      colors={['#8B45FF', '#581C87', '#3B0764']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Trophy size={24} color="#FFD700" />
            <Text style={styles.title}>Rewards & Progress</Text>
          </View>

          {/* Weekly Goal Card */}
          <WeeklyGoalCard
            weeklyGoal={userStats.weeklyGoal}
            weeklySpent={weeklySpent}
            isOverBudget={isOverBudget}
            editingGoal={editingGoal}
            goalInput={goalInput}
            onEditStart={() => setEditingGoal(true)}
            onGoalInputChange={setGoalInput}
            onGoalSave={handleGoalSave}
            onGoalCancel={handleGoalCancel}
          />

          {/* Weekly Summary */}
          <View style={styles.summaryContainer}>
            <Text style={styles.sectionTitle}>This Week's Adventure</Text>
            
            <View style={styles.summaryStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{weeklyExpenses.length}</Text>
                <Text style={styles.statLabel}>Quests</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {DateUtils.formatCurrency(weeklySpent)}
                </Text>
                <Text style={styles.statLabel}>Total Spent</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {weeklyExpenses.length > 0 
                    ? DateUtils.formatCurrency(weeklySpent / weeklyExpenses.length)
                    : '$0.00'
                  }
                </Text>
                <Text style={styles.statLabel}>Average</Text>
              </View>
            </View>

            {getTopCategories().length > 0 && (
              <View style={styles.categoriesContainer}>
                <Text style={styles.categoriesTitle}>Top Categories</Text>
                {getTopCategories().map(([category, amount], index) => (
                  <View key={category} style={styles.categoryItem}>
                    <View style={styles.categoryRank}>
                      <Star size={16} color="#FFD700" />
                      <Text style={styles.categoryRankText}>#{index + 1}</Text>
                    </View>
                    <Text style={styles.categoryName}>{category}</Text>
                    <Text style={styles.categoryAmount}>
                      {DateUtils.formatCurrency(amount)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Achievements Section */}
          <View style={styles.badgesContainer}>
            <Text style={styles.sectionTitle}>🏆 Achievements</Text>
            
            {userStats.badges.length > 0 ? (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.badgesScroll}
              >
                {userStats.badges.map((badge, index) => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </ScrollView>
            ) : (
              <View style={styles.noBadgesContainer}>
                <Text style={styles.noBadgesEmoji}>🎯</Text>
                <Text style={styles.noBadgesText}>Complete quests to unlock achievements!</Text>
                <Text style={styles.noBadgesSubtext}>
                  Keep tracking your spending daily to earn your first badge
                </Text>
              </View>
            )}
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  summaryContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 16,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
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
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  categoriesContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 16,
  },
  categoriesTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  categoryRank: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 40,
  },
  categoryRankText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFD700',
    marginLeft: 4,
  },
  categoryName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    flex: 1,
    marginLeft: 8,
  },
  categoryAmount: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  badgesContainer: {
    margin: 16,
  },
  badgesScroll: {
    paddingLeft: 8,
  },
  noBadgesContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  noBadgesEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  noBadgesText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  noBadgesSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    maxWidth: 240,
  },
  bottomSpacer: {
    height: 100,
  },
});