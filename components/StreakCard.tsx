import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame, Trophy, User } from 'lucide-react-native';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  userName: string;
  level: number;
  xp: number;
}

export default function StreakCard({ 
  currentStreak, 
  longestStreak, 
  userName, 
  level, 
  xp 
}: StreakCardProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
        style={styles.gradient}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.avatar}
            >
              <Text style={styles.avatarEmoji}>🌱</Text>
            </LinearGradient>
            <Text style={styles.levelBadge}>LEVEL {level}</Text>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userTitle}>Sprout</Text>
          </View>
        </View>

        {/* Streak Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Flame size={20} color="#FF6B6B" />
            </View>
            <Text style={styles.statNumber}>{currentStreak}</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Trophy size={20} color="#FFD700" />
            </View>
            <Text style={styles.statNumber}>{longestStreak}</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
        </View>

        {/* Streak Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.streakMessage}>
            {currentStreak === 1 ? '1 day streak!' : `${currentStreak} day streak!`}
          </Text>
          <Text style={styles.streakSubtext}>
            {currentStreak === 1 ? 'Great start!' : 'Keep it up!'}
          </Text>
          {longestStreak === currentStreak && currentStreak > 1 && (
            <View style={styles.bestBadge}>
              <Text style={styles.bestBadgeText}>Best: {longestStreak}</Text>
            </View>
          )}
        </View>
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarEmoji: {
    fontSize: 28,
  },
  levelBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
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
  divider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 20,
  },
  messageContainer: {
    alignItems: 'center',
  },
  streakMessage: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  streakSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  bestBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  bestBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});