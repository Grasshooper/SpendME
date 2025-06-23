import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Repeat } from 'lucide-react-native';
import { Expense } from '@/types/data';
import { DateUtils } from '@/utils/dateUtils';

interface ExpenseCardProps {
  expense: Expense;
}

export default function ExpenseCard({ expense }: ExpenseCardProps) {
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string[] } = {
      'Food & Dining': ['#FF6B6B', '#FF5252'],
      'Transportation': ['#4ECDC4', '#26A69A'],
      'Shopping': ['#45B7D1', '#2196F3'],
      'Entertainment': ['#96CEB4', '#66BB6A'],
      'Bills & Utilities': ['#FFEAA7', '#FFCA28'],
      'Healthcare': ['#DDA0DD', '#BA68C8'],
      'Education': ['#98D8C8', '#4DB6AC'],
      'Travel': ['#F7DC6F', '#FDD835'],
      'Personal Care': ['#F8BBD9', '#E91E63'],
      'Other': ['#AED6F1', '#64B5F6'],
    };
    return colors[category] || ['#AED6F1', '#64B5F6'];
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={[styles.categoryTag, { backgroundColor: getCategoryColor(expense.category)[0] + '40' }]}>
            <Text style={[styles.categoryText, { color: getCategoryColor(expense.category)[0] }]}>
              {expense.category}
            </Text>
          </View>
          <Text style={styles.amountText}>{DateUtils.formatCurrency(expense.amount)}</Text>
        </View>
        
        {expense.notes && (
          <Text style={styles.notesText}>{expense.notes}</Text>
        )}
        
        <View style={styles.footer}>
          <View style={styles.dateContainer}>
            <Calendar size={14} color="rgba(255, 255, 255, 0.6)" />
            <Text style={styles.dateText}>
              {new Date(expense.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
          </View>
          {expense.isRecurring && (
            <View style={styles.recurringBadge}>
              <Repeat size={12} color="#FFD700" />
              <Text style={styles.recurringText}>Recurring</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  gradient: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  amountText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  notesText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
    marginLeft: 6,
  },
  recurringBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  recurringText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#FFD700',
    marginLeft: 4,
  },
});