import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Target, CreditCard as Edit3, Save, X } from 'lucide-react-native';
import { DateUtils } from '@/utils/dateUtils';

interface WeeklyGoalCardProps {
  weeklyGoal: number;
  weeklySpent: number;
  isOverBudget: boolean;
  editingGoal: boolean;
  goalInput: string;
  onEditStart: () => void;
  onGoalInputChange: (value: string) => void;
  onGoalSave: () => void;
  onGoalCancel: () => void;
}

export default function WeeklyGoalCard({
  weeklyGoal,
  weeklySpent,
  isOverBudget,
  editingGoal,
  goalInput,
  onEditStart,
  onGoalInputChange,
  onGoalSave,
  onGoalCancel,
}: WeeklyGoalCardProps) {
  const goalProgress = weeklyGoal > 0 ? Math.min(weeklySpent / weeklyGoal, 1) : 0;

  return (
    <View style={[styles.container, isOverBudget && styles.overBudgetContainer]}>
      <LinearGradient
        colors={
          isOverBudget 
            ? ['rgba(255, 107, 107, 0.2)', 'rgba(239, 68, 68, 0.1)']
            : ['rgba(16, 185, 129, 0.2)', 'rgba(5, 150, 105, 0.1)']
        }
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Target size={20} color={isOverBudget ? '#FF6B6B' : '#10B981'} />
            <Text style={styles.title}>Weekly Goal</Text>
          </View>
          
          {!editingGoal ? (
            <TouchableOpacity style={styles.editButton} onPress={onEditStart}>
              <Edit3 size={16} color="rgba(255, 255, 255, 0.7)" />
            </TouchableOpacity>
          ) : (
            <View style={styles.editActions}>
              <TouchableOpacity style={styles.saveButton} onPress={onGoalSave}>
                <Save size={16} color="#10B981" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={onGoalCancel}>
                <X size={16} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {editingGoal ? (
          <TextInput
            style={styles.goalInput}
            value={goalInput}
            onChangeText={onGoalInputChange}
            placeholder="Enter weekly goal"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            keyboardType="decimal-pad"
          />
        ) : (
          <Text style={styles.goalAmount}>
            {DateUtils.formatCurrency(weeklyGoal)}
          </Text>
        )}

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={isOverBudget ? ['#FF6B6B', '#E53E3E'] : ['#10B981', '#059669']}
              style={[styles.progressFill, { width: `${goalProgress * 100}%` }]}
            />
          </View>
          <Text style={[styles.progressText, isOverBudget && styles.progressTextOver]}>
            {DateUtils.formatCurrency(weeklySpent)} spent this week
          </Text>
        </View>

        {isOverBudget && (
          <View style={styles.overBudgetAlert}>
            <Text style={styles.overBudgetText}>
              You're {DateUtils.formatCurrency(weeklySpent - weeklyGoal)} over budget
            </Text>
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
    borderWidth: 2,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  overBudgetContainer: {
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  gradient: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  editButton: {
    padding: 8,
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  saveButton: {
    padding: 8,
  },
  cancelButton: {
    padding: 8,
  },
  goalAmount: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  goalInput: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
    color: 'rgba(255, 255, 255, 0.8)',
  },
  progressTextOver: {
    color: '#FF6B6B',
  },
  overBudgetAlert: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  overBudgetText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B6B',
    textAlign: 'center',
  },
});