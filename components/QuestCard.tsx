import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Zap, CircleCheck as CheckCircle, ArrowRight } from 'lucide-react-native';

interface QuestCardProps {
  type: 'morning' | 'evening';
  title: string;
  subtitle: string;
  xpReward: number;
  icon: string;
  isCompleted: boolean;
  onStart: () => void;
}

export default function QuestCard({
  type,
  title,
  subtitle,
  xpReward,
  icon,
  isCompleted,
  onStart,
}: QuestCardProps) {
  const gradientColors = type === 'morning' 
    ? ['rgba(255, 165, 0, 0.2)', 'rgba(255, 140, 0, 0.1)']
    : ['rgba(138, 43, 226, 0.2)', 'rgba(75, 0, 130, 0.1)'];

  return (
    <TouchableOpacity
      style={[styles.container, isCompleted && styles.completedContainer]}
      onPress={onStart}
      disabled={isCompleted}
    >
      <LinearGradient
        colors={isCompleted ? ['rgba(16, 185, 129, 0.2)', 'rgba(5, 150, 105, 0.1)'] : gradientColors}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconEmoji}>{icon}</Text>
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
            {isCompleted && (
              <View style={styles.completedBadge}>
                <CheckCircle size={20} color="#10B981" />
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <View style={styles.xpContainer}>
              <Zap size={16} color="#FFD700" />
              <Text style={styles.xpText}>+{xpReward} XP</Text>
            </View>
            
            {!isCompleted && (
              <View style={styles.startButton}>
                <Text style={styles.startButtonText}>Start Quest</Text>
                <ArrowRight size={16} color="#8B5CF6" />
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  completedContainer: {
    opacity: 0.8,
  },
  gradient: {
    padding: 20,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconEmoji: {
    fontSize: 24,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  completedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  xpText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFD700',
    marginLeft: 4,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  startButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginRight: 6,
  },
});