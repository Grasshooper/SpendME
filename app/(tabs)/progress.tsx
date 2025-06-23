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
import { Target, Edit3, Save, X } from 'lucide-react-native';
import BadgeCard from '@/components/BadgeCard';
import { StorageService } from '@/utils/storage';
import { DateUtils } from '@/utils/dateUtils';
import { UserStats, Expense } from '@/types/data';

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
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Progress</Text>
        </View>

        {/* Weekly Goal Section */}
        <View style={[styles.goalContainer, isOverBudget && styles.goalContainerOverBudget]}>
          <View style={styles.goalHeader}>
            <View style={styles.goalTitleContainer}>
              <Target size={20} color={isOverBudget ? '#EF4444' : '#10B981'} />
              <Text style={styles.goalTitle}>Weekly Goal</Text>
            </View>
            
            {!editingGoal ? (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setEditingGoal(true)}
              >
                <Edit3 size={16} color="#6B7280" />
              </TouchableOpacity>
            ) : (
              <View style={styles.editActions}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleGoalSave}
                >
                  <Save size={16} color="#10B981" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleGoalCancel}
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {editingGoal ? (
            <TextInput
              style={styles.goalInput}
              value={goalInput}
              onChangeText={setGoalInput}
              placeholder="Enter weekly goal"
              keyboardType="decimal-pad"
            />
          ) : (
            <Text style={styles.goalAmount}>
              {DateUtils.formatCurrency(userStats.weeklyGoal)}
            </Text>
          )}

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${goalProgress * 100}%`,
                    backgroundColor: isOverBudget ? '#EF4444' : '#10B981'
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressText, isOverBudget && styles.progressTextOver]}>
              {DateUtils.formatCurrency(weeklySpent)} spent this week
            </Text>
          </View>

          {isOverBudget && (
            <Text style={styles.overBudgetText}>
              You're {DateUtils.formatCurrency(weeklySpent - userStats.weeklyGoal)} over budget
            </Text>
          )}
        </View>

        {/* Weekly Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>This Week's Summary</Text>
          
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{weeklyExpenses.length}</Text>
              <Text style={styles.statLabel}>Expenses</Text>
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
                  <Text style={styles.categoryRank}>#{index + 1}</Text>
                  <Text style={styles.categoryName}>{category}</Text>
                  <Text style={styles.categoryAmount}>
                    {DateUtils.formatCurrency(amount)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Badges Section */}
        <View style={styles.badgesContainer}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          
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
              <Text style={styles.noBadgesText}>No badges yet</Text>
              <Text style={styles.noBadgesSubtext}>
                Keep checking in daily to unlock your first achievement!
              </Text>
            </View>
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
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
});