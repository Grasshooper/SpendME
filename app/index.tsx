import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame, Trophy, Zap, Star, Calendar, Settings, User, Plus, Target } from 'lucide-react-native';
import { router } from 'expo-router';
import QuestCard from '@/components/QuestCard';
import StreakCard from '@/components/StreakCard';
import BadgeCollection from '@/components/BadgeCollection';
import MorningQuestModal from '@/components/MorningQuestModal';
import EveningQuestModal from '@/components/EveningQuestModal';
import { StorageService } from '@/utils/storage';
import { DateUtils } from '@/utils/dateUtils';
import { CheckIn, UserStats, Expense } from '@/types/data';

const { width } = Dimensions.get('window');

const MORNING_UTILITIES = [
  'Rent/Mortgage Payment',
  'Electricity Bill',
  'Gas Bill',
  'Water Bill',
  'Internet/Phone Bill',
  'Insurance Payment',
  'Loan Payment',
  'Subscription Services',
];

const EVENING_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Personal Care',
  'Education',
  'Other',
];

export default function AdventureScreen() {
  const [morningCheckIn, setMorningCheckIn] = useState<CheckIn | null>(null);
  const [eveningCheckIn, setEveningCheckIn] = useState<CheckIn | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    currentStreak: 1,
    longestStreak: 1,
    totalCheckIns: 0,
    badges: [],
    weeklyGoal: 600,
    lastCheckInDate: '',
  });
  const [showMorningModal, setShowMorningModal] = useState(false);
  const [showEveningModal, setShowEveningModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userName] = useState(userName);
  const [userLevel] = useState(1);
  const [userXP] = useState(75);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const checkIns = await StorageService.getCheckIns();
    const stats = await StorageService.getUserStats();
    const today = DateUtils.getTodayString();

    const todayMorning = checkIns.find(c => c.date === today && c.type === 'morning');
    const todayEvening = checkIns.find(c => c.date === today && c.type === 'evening');

    setMorningCheckIn(todayMorning || null);
    setEveningCheckIn(todayEvening || null);
    setUserStats(stats);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleMorningQuestComplete = async (utilities: { [key: string]: number }) => {
    const today = DateUtils.getTodayString();
    const checkIn: CheckIn = {
      id: `${today}-morning`,
      date: today,
      type: 'morning',
      questions: utilities,
      completed: true,
    };

    await StorageService.saveCheckIn(checkIn);
    
    // Save utilities as expenses
    for (const [utility, amount] of Object.entries(utilities)) {
      if (amount > 0) {
        const expense: Expense = {
          id: `${Date.now()}-${utility}`,
          amount,
          category: 'Bills & Utilities',
          notes: utility,
          date: today,
          isRecurring: true,
        };
        await StorageService.saveExpense(expense);
      }
    }
    
    await updateUserStats();
    setMorningCheckIn(checkIn);
    setShowMorningModal(false);
  };

  const handleEveningQuestComplete = async (expenses: { category: string; amount: number; notes: string }[]) => {
    const today = DateUtils.getTodayString();
    const checkIn: CheckIn = {
      id: `${today}-evening`,
      date: today,
      type: 'evening',
      questions: {},
      completed: true,
    };

    await StorageService.saveCheckIn(checkIn);
    
    // Save expenses
    for (const expenseData of expenses) {
      if (expenseData.amount > 0) {
        const expense: Expense = {
          id: `${Date.now()}-${expenseData.category}`,
          amount: expenseData.amount,
          category: expenseData.category,
          notes: expenseData.notes,
          date: today,
          isRecurring: false,
        };
        await StorageService.saveExpense(expense);
      }
    }
    
    await updateUserStats();
    setEveningCheckIn(checkIn);
    setShowEveningModal(false);
  };

  const updateUserStats = async () => {
    const newStats = { ...userStats };
    newStats.totalCheckIns += 1;
    
    if (DateUtils.isToday(userStats.lastCheckInDate)) {
      // Same day, don't increment streak
    } else if (DateUtils.daysSince(userStats.lastCheckInDate) === 1) {
      newStats.currentStreak += 1;
    } else {
      newStats.currentStreak = 1;
    }
    
    newStats.longestStreak = Math.max(newStats.longestStreak, newStats.currentStreak);
    newStats.lastCheckInDate = DateUtils.getTodayString();

    // Check for new badges
    if (newStats.currentStreak === 3 && !newStats.badges.find(b => b.id === 'first-week')) {
      newStats.badges.push({
        id: 'first-week',
        name: '3-Day Streak',
        description: 'Tracked spending for 3 days in a row',
        icon: '🔥',
        unlockedAt: new Date().toISOString(),
        type: 'streak',
      });
    }

    await StorageService.saveUserStats(newStats);
    setUserStats(newStats);
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Ready for today\'s adventure?';
    if (hour < 18) return 'How\'s your quest going?';
    return 'Time to reflect on your adventure!';
  };

  return (
    <LinearGradient
      colors={['#8B45FF', '#581C87', '#3B0764']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.welcomeText}>Welcome back, {userName}!</Text>
              <Text style={styles.subtitleText}>{getWelcomeMessage()}</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => router.push('/profile')}
              >
                <User size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => router.push('/settings')}
              >
                <Settings size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Streak Card */}
          <StreakCard
            currentStreak={userStats.currentStreak}
            longestStreak={userStats.longestStreak}
            userName={userName}
            level={userLevel}
            xp={userXP}
          />

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={[styles.progressFill, { width: '75%' }]}
              />
            </View>
          </View>

          {/* Quick Access */}
          <View style={styles.quickAccessContainer}>
            <Text style={styles.quickAccessTitle}>⚡ Quick Access</Text>
            <View style={styles.quickAccessButtons}>
              <TouchableOpacity 
                style={styles.quickAccessButton}
                onPress={() => router.push('/rewards')}
              >
                <Trophy size={24} color="#FFD700" />
                <Text style={styles.quickAccessButtonText}>Weekly Summary</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.quickAccessButton}
                onPress={() => router.push('/profile')}
              >
                <User size={24} color="#8B5CF6" />
                <Text style={styles.quickAccessButtonText}>Profile & Stats</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Badge Collection Preview */}
          <BadgeCollection badges={userStats.badges} isPreview={true} />

          {/* Today's Quests */}
          <View style={styles.sectionHeader}>
            <Zap size={20} color="#FFD700" />
            <Text style={styles.sectionTitle}>Today's Quests</Text>
          </View>

          <QuestCard
            type="morning"
            title="Morning Quest: Bills & Utilities"
            subtitle="Log your monthly bills and utility payments"
            xpReward={50}
            icon="🏠"
            isCompleted={morningCheckIn?.completed || false}
            onStart={() => setShowMorningModal(true)}
          />

          <QuestCard
            type="evening"
            title="Evening Quest: Daily Expenses"
            subtitle="Track what you spent today"
            xpReward={100}
            icon="🌙"
            isCompleted={eveningCheckIn?.completed || false}
            onStart={() => setShowEveningModal(true)}
          />

          <View style={styles.bottomSpacer} />
        </ScrollView>

        <MorningQuestModal
          visible={showMorningModal}
          onClose={() => setShowMorningModal(false)}
          utilities={MORNING_UTILITIES}
          onComplete={handleMorningQuestComplete}
        />

        <EveningQuestModal
          visible={showEveningModal}
          onClose={() => setShowEveningModal(false)}
          categories={EVENING_CATEGORIES}
          onComplete={handleEveningQuestComplete}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  quickAccessContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  quickAccessTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  quickAccessButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAccessButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  quickAccessButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginTop: 8,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 40,
  },
});