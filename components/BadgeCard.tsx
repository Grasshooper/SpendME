import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Badge } from '@/types/data';
import { Award, Calendar, DollarSign } from 'lucide-react-native';

interface BadgeCardProps {
  badge: Badge;
}

export default function BadgeCard({ badge }: BadgeCardProps) {
  const getIcon = () => {
    switch (badge.type) {
      case 'streak':
        return <Calendar size={20} color="#8B5CF6" />;
      case 'spending':
        return <DollarSign size={20} color="#10B981" />;
      case 'consistency':
        return <Award size={20} color="#F59E0B" />;
      default:
        return <Award size={20} color="#6B7280" />;
    }
  };

  const getBorderColor = () => {
    switch (badge.type) {
      case 'streak':
        return '#8B5CF6';
      case 'spending':
        return '#10B981';
      case 'consistency':
        return '#F59E0B';
      default:
        return 'rgba(255, 255, 255, 0.2)';
    }
  };

  return (
    <View style={[styles.container, { borderColor: getBorderColor() }]}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
        style={styles.gradient}
      >
        <View style={styles.iconContainer}>
          {getIcon()}
        </View>
        <Text style={styles.emoji}>{badge.icon}</Text>
        <Text style={styles.name}>{badge.name}</Text>
        <Text style={styles.description}>{badge.description}</Text>
        <Text style={styles.unlockedDate}>
          Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
        </Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    margin: 8,
    borderWidth: 2,
    minWidth: 140,
    overflow: 'hidden',
  },
  gradient: {
    padding: 16,
    alignItems: 'center',
    minHeight: 160,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 8,
  },
  unlockedDate: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
  },
});