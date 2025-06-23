import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User } from 'lucide-react-native';

interface ProfileCardProps {
  userName: string;
  level: number;
  xp: number;
  currentStreak: number;
  totalBadges: number;
}

export default function ProfileCard({
  userName,
  level,
  xp,
  currentStreak,
  totalBadges,
}: ProfileCardProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
        style={styles.gradient}
      >
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

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{currentStreak}</Text>
            <Text style={styles.statLabel}>days</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{currentStreak}</Text>
            <Text style={styles.statLabel}>days</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{xp}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>USD</Text>
            <Text style={styles.statLabel}>Currency</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 20,
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
    marginRight: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarEmoji: {
    fontSize: 36,
  },
  levelBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.7)',
  },
});