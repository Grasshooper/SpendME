import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DollarSign, Target, TrendingUp } from 'lucide-react-native';
import { Expense } from '@/types/data';
import { DateUtils } from '@/utils/dateUtils';

interface WeeklySummaryCardProps {
  expenses: Expense[];
  weeklyGoal: number;
}

export default function WeeklySummaryCard({ expenses, weeklyGoal }: WeeklySummaryCardProps) {
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = Math.max(weeklyGoal - totalSpent, 0);
  const progress = weeklyGoal > 0 ? Math.min(totalSpent / weeklyGoal, 1) : 0;
  const isOverBudget = totalSpent > weeklyGoal && weeklyGoal > 0;

  const getWeekRange = () => {
    const start = DateUtils.getWeekStart();
    const end = DateUtils.getWeekEnd();
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Weekly Quest Log</Text>
          <Text style={styles.dateRange}>{getWeekRange()}</Text>
        </View>

        <View style={styles.amountContainer}>
          <DollarSign size={24} color="#10B981" />
          <Text style={styles.totalAmount}>{DateUtils.formatCurrency(totalSpent)}</Text>
          <Text style={styles.totalLabel}>Total spent this week</Text>
        </View>

        {weeklyGoal > 0 && (
          <View style={styles.goalContainer}>
            <View style={styles.goalHeader}>
              <Target size={16} color={isOverBudget ? '#FF6B6B' : '#10B981'} />
              <Text style={styles.goalTitle}>Weekly Goal</Text>
              <Text style={styles.goalAmount}>
                {DateUtils.formatCurrency(totalSpent)} / {DateUtils.formatCurrency(weeklyGoal)}
              </Text>
            </View>
            
            <View style={styles.progressBar}>
              <LinearGradient
                colors={isOverBudget ? ['#FF6B6B', '#E53E3E'] : ['#10B981', '#059669']}
                style={[styles.progressFill, { width: `${Math.min(progress * 100, 100)}%` }]}
              />
            </View>
            
            <Text style={[styles.remainingText, isOverBudget && styles.overBudgetText]}>
              {isOverBudget 
                ? `${DateUtils.formatCurrency(totalSpent - weeklyGoal)} over budget`
                : `${DateUtils.formatCurrency(remaining)} remaining`
              }
            </Text>
          </View>
        )}

        {expenses.length > 0 && (
          <View style={styles.topCategoryContainer}>
            <TrendingUp size={16} color="#FFD700" />
            <Text style={styles.topCategoryTitle}>Top Categories</Text>
            <View style={styles.topCategory}>
              <Text style={styles.topCategoryName}>🍽️ Food</Text>
              <Text style={styles.topCategoryAmount}>{DateUtils.formatCurrency(totalSpent)}</Text>
            </View>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  gradient: {
    padding: 20,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  dateRange: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  totalAmount: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  goalContainer: {
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 6,
    flex: 1,
  },
  goalAmount: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  remainingText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
    textAlign: 'center',
  },
  overBudgetText: {
    color: '#FF6B6B',
  },
  topCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 16,
  },
  topCategoryTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 6,
    flex: 1,
  },
  topCategory: {
    alignItems: 'flex-end',
  },
  topCategoryName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  topCategoryAmount: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});