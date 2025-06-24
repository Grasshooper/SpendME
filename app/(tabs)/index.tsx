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
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame, Trophy, Zap, Star, Calendar, Settings, User, Plus } from 'lucide-react-native';
import QuestCard from '@/components/QuestCard';
import StreakCard from '@/components/StreakCard';
import BadgeCollection from '@/components/BadgeCollection';
import MorningQuestModal from '@/components/MorningQuestModal';
import EveningQuestModal from '@/components/EveningQuestModal';
import { StorageService } from '@/utils/storage';
import { DateUtils } from '@/utils/dateUtils';
import { CheckIn, UserStats, Expense } from '@/types/data';
import GameGradientBackground from '@/components/GameGradientBackground';
import FloatingElements from '@/components/FloatingElements';
import BounceIn from '@/components/BounceIn';
import SlideUp from '@/components/SlideUp';
import PulseRing from '@/components/PulseRing';
import { useRouter } from 'expo-router';

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
    weeklyGoal: 0,
    lastCheckInDate: '',
  });
  const [showMorningModal, setShowMorningModal] = useState(false);
  const [showEveningModal, setShowEveningModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userName] = useState('Thanks');
  const [userLevel] = useState(1);
  const [userXP] = useState(75);
  const router = useRouter();

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
    return 'Ready for today\'s spenditure?';
  };

  return (
    <GameGradientBackground type={morningCheckIn ? 'morning' : 'evening'}>
      <FloatingElements />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <SlideUp>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.welcomeText}>Welcome back!</Text>
                <Text style={styles.subtitleText}>Ready for your next quest?</Text>
              </View>
              <View style={styles.headerRight}>
                <TouchableOpacity
                  style={styles.headerButton}
                  activeOpacity={0.8}
                  onPress={() => router.push('/profile')}
                >
                  <PulseRing size={40} color="#FFD700">
                    <User size={24} color="#FFD700" />
                  </PulseRing>
                </TouchableOpacity>
              </View>
            </View>
          </SlideUp>

          <BounceIn>
            <View style={styles.progressContainer}>
              <Text style={styles.quickAccessTitle}>XP Progress</Text>
              <View style={styles.progressBar}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      width: `${userXP}%`,
                      backgroundColor: '#FFD700',
                    },
                  ]}
                />
              </View>
            </View>
          </BounceIn>

          <SlideUp>
            <View style={styles.quickAccessContainer}>
              <Text style={styles.quickAccessTitle}>Quick Access</Text>
              <View style={styles.quickAccessButtons}>
                <TouchableOpacity
                  style={styles.quickAccessButton}
                  activeOpacity={0.85}
                  onPress={() => setShowMorningModal(true)}
                >
                  <Flame size={28} color="#FFA726" />
                  <Text style={styles.quickAccessButtonText}>Morning Quest</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickAccessButton}
                  activeOpacity={0.85}
                  onPress={() => setShowEveningModal(true)}
                >
                  <Star size={28} color="#8B45FF" />
                  <Text style={styles.quickAccessButtonText}>Evening Quest</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SlideUp>

          <BounceIn>
            <View style={styles.sectionHeader}>
              <Trophy size={20} color="#FFD700" />
              <Text style={styles.sectionTitle}>Achievements</Text>
            </View>
            <BadgeCollection badges={userStats.badges} isPreview />
          </BounceIn>

          <SlideUp>
            <View style={styles.sectionHeader}>
              <Zap size={20} color="#FFD700" />
              <Text style={styles.sectionTitle}>Streaks</Text>
            </View>
            <StreakCard
              currentStreak={userStats.currentStreak}
              longestStreak={userStats.longestStreak}
              userName={userName}
              level={userLevel}
              xp={userXP}
            />
          </SlideUp>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
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
    </GameGradientBackground>
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
    height: 100,
  },
  quickAccessTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  quickAccessContainer: {
    padding: 20,
  },
  quickAccessButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAccessButton: {
    width: '48%',
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickAccessButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    marginTop: 8,
  },
});