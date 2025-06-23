import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, ArrowRight } from 'lucide-react-native';
import { Badge } from '@/types/data';

interface BadgeCollectionProps {
  badges: Badge[];
  isPreview?: boolean;
}

const PLACEHOLDER_BADGES = [
  { id: 'streak-3', name: '3-Day Streak', icon: '💧', locked: true },
  { id: 'no-spend', name: 'No-Spend Day', icon: '💎', locked: true },
  { id: 'week-logger', name: '7-Day Logger', icon: '📅', locked: true },
];

export default function BadgeCollection({ badges, isPreview = false }: BadgeCollectionProps) {
  const displayBadges = badges.length > 0 ? badges : PLACEHOLDER_BADGES;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Trophy size={20} color="#FFD700" />
        <Text style={styles.title}>Badge Collection</Text>
      </View>

      <View style={styles.badgeGrid}>
        {displayBadges.slice(0, isPreview ? 3 : displayBadges.length).map((badge, index) => (
          <View key={badge.id || index} style={styles.badgeContainer}>
            <LinearGradient
              colors={
                'locked' in badge && badge.locked
                  ? ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']
                  : ['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']
              }
              style={styles.badgeCard}
            >
              <Text style={[
                styles.badgeIcon,
                'locked' in badge && badge.locked && styles.lockedIcon
              ]}>
                {badge.icon}
              </Text>
              <Text style={[
                styles.badgeName,
                'locked' in badge && badge.locked && styles.lockedText
              ]}>
                {badge.name}
              </Text>
              {'description' in badge && (
                <Text style={[
                  styles.badgeDescription,
                  'locked' in badge && badge.locked && styles.lockedText
                ]}>
                  {badge.description}
                </Text>
              )}
              {'locked' in badge && badge.locked && (
                <Text style={styles.lockedSubtext}>
                  {'name' in badge && badge.name === '3-Day Streak' && 'Tracked spending for 3 days in a row'}
                  {'name' in badge && badge.name === 'No-Spend Day' && 'Logged a day with $0 in expenses'}
                  {'name' in badge && badge.name === '7-Day Logger' && 'Logged spending for 7 days total'}
                </Text>
              )}
            </LinearGradient>
          </View>
        ))}
      </View>

      {badges.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🎯</Text>
          <Text style={styles.emptyText}>Complete quests to unlock badges!</Text>
        </View>
      )}

      {isPreview && (
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All Achievements</Text>
          <ArrowRight size={16} color="#8B5CF6" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeContainer: {
    width: '30%',
    minWidth: 100,
  },
  badgeCard: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: 120,
    justifyContent: 'center',
  },
  badgeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  lockedIcon: {
    opacity: 0.3,
  },
  badgeName: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  lockedText: {
    color: 'rgba(255, 255, 255, 0.4)',
  },
  lockedSubtext: {
    fontSize: 9,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.3)',
    textAlign: 'center',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 12,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#8B5CF6',
    marginRight: 6,
  },
});