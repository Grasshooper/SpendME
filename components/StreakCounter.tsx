import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Flame, Trophy } from 'lucide-react-native';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
}

export default function StreakCounter({ currentStreak, longestStreak }: StreakCounterProps) {
  return (
    <View style={styles.container}>
      <View style={styles.streakItem}>
        <View style={styles.iconContainer}>
          <Flame size={24} color="#EF4444" />
        </View>
        <View style={styles.streakContent}>
          <Text style={styles.streakNumber}>{currentStreak}</Text>
          <Text style={styles.streakLabel}>Current Streak</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.streakItem}>
        <View style={styles.iconContainer}>
          <Trophy size={24} color="#F59E0B" />
        </View>
        <View style={styles.streakContent}>
          <Text style={styles.streakNumber}>{longestStreak}</Text>
          <Text style={styles.streakLabel}>Best Streak</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  streakItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  streakContent: {
    flex: 1,
  },
  streakNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  streakLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 2,
  },
  divider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
});