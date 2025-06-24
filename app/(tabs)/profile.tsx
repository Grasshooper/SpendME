import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Calendar, Zap, Trophy, Settings, LogOut, DollarSign, TrendingUp, ArrowLeft } from 'lucide-react-native';
import ProfileCard from '@/components/ProfileCard';
import StatsCard from '@/components/StatsCard';
import ExpenseCard from '@/components/ExpenseCard';
import { StorageService } from '@/utils/storage';
import { DateUtils } from '@/utils/dateUtils';
import { UserStats, Expense } from '@/types/data';
import GameGradientBackground from '@/components/GameGradientBackground';
import FloatingElements from '@/components/FloatingElements';
import BounceIn from '@/components/BounceIn';
import SlideUp from '@/components/SlideUp';
import PulseRing from '@/components/PulseRing';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const [userStats, setUserStats] = useState<UserStats>({
    currentStreak: 1,
    longestStreak: 1,
    totalCheckIns: 0,
    badges: [],
    weeklyGoal: 600,
    lastCheckInDate: '',
  });
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userName] = useState('Gautam');
  const [userLevel] = useState(1);
  const [userXP] = useState(75);
  const [activeTab, setActiveTab] = useState<'profile' | 'expenses' | 'progress'>('profile');
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const stats = await StorageService.getUserStats();
    const expenseData = await StorageService.getExpenses();
    setUserStats(stats);
    setExpenses(expenseData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getTotalSpent = () => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getMonthlySpent = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return expenses
      .filter(e => {
        const expenseDate = new Date(e.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getWeeklyExpenses = () => {
    const weekStart = DateUtils.getWeekStart();
    return expenses.filter(e => new Date(e.date) >= weekStart);
  };

  const renderProfileTab = () => (
    <>
      {/* Profile Card */}
      <ProfileCard
        userName={userName}
        level={userLevel}
        xp={userXP}
        currentStreak={userStats.currentStreak}
        totalBadges={userStats.badges.length}
      />

      {/* Monthly Calendar Preview */}
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <Calendar size={20} color="#FFFFFF" />
          <Text style={styles.calendarTitle}>MONTHLY SPENDING CALENDAR</Text>
        </View>
        <TouchableOpacity style={styles.calendarPreview}>
          <Text style={styles.calendarMonth}>June 2025</Text>
          <Text style={styles.calendarAmount}>
            {DateUtils.formatCurrency(getMonthlySpent())}
          </Text>
          <Text style={styles.calendarSubtext}>This month's total</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatsCard
          icon={<Zap size={20} color="#FFD700" />}
          title="Current Streak"
          value={`${userStats.currentStreak} days`}
          subtitle="Great start!"
        />
        <StatsCard
          icon={<Trophy size={20} color="#FF6B6B" />}
          title="Best Streak"
          value={`${userStats.longestStreak} days`}
          subtitle=""
        />
        <StatsCard
          icon={<Zap size={20} color="#4ECDC4" />}
          title="Total XP"
          value={userXP.toString()}
          subtitle=""
        />
        <StatsCard
          icon={<User size={20} color="#45B7D1" />}
          title="Currency"
          value="USD"
          subtitle=""
        />
      </View>

      {/* Achievements Preview */}
      <View style={styles.achievementsContainer}>
        <View style={styles.achievementsHeader}>
          <Trophy size={20} color="#FFD700" />
          <Text style={styles.achievementsTitle}>Achievements</Text>
        </View>
        
        {userStats.badges.length > 0 ? (
          <View style={styles.achievementsList}>
            {userStats.badges.slice(0, 3).map((badge, index) => (
              <View key={badge.id} style={styles.achievementItem}>
                <Text style={styles.achievementEmoji}>{badge.icon}</Text>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementName}>{badge.name}</Text>
                  <Text style={styles.achievementDesc}>{badge.description}</Text>
                </View>
              </View>
            ))}
            {userStats.badges.length > 3 && (
              <Text style={styles.moreAchievements}>
                +{userStats.badges.length - 3} more achievements
              </Text>
            )}
          </View>
        ) : (
          <View style={styles.noAchievements}>
            <Text style={styles.noAchievementsEmoji}>🎯</Text>
            <Text style={styles.noAchievementsText}>
              Complete activities to unlock achievements!
            </Text>
          </View>
        )}
      </View>
    </>
  );

  const renderExpensesTab = () => (
    <>
      <View style={styles.expenseSummary}>
        <DollarSign size={24} color="#10B981" />
        <Text style={styles.expenseSummaryTitle}>Recent Expenses</Text>
        <Text style={styles.expenseSummaryAmount}>
          {DateUtils.formatCurrency(getTotalSpent())}
        </Text>
      </View>
      
      <ScrollView style={styles.expensesList}>
        {expenses.slice(0, 10).map((expense) => (
          <ExpenseCard key={expense.id} expense={expense} />
        ))}
        {expenses.length === 0 && (
          <View style={styles.noExpenses}>
            <Text style={styles.noExpensesText}>No expenses yet</Text>
            <Text style={styles.noExpensesSubtext}>
              Complete quests to start tracking your spending
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );

  const renderProgressTab = () => (
    <>
      <View style={styles.progressSummary}>
        <TrendingUp size={24} color="#8B5CF6" />
        <Text style={styles.progressTitle}>Weekly Progress</Text>
      </View>
      
      <View style={styles.progressStats}>
        <View style={styles.progressStatItem}>
          <Text style={styles.progressStatNumber}>{getWeeklyExpenses().length}</Text>
          <Text style={styles.progressStatLabel}>Expenses This Week</Text>
        </View>
        <View style={styles.progressStatItem}>
          <Text style={styles.progressStatNumber}>
            {DateUtils.formatCurrency(getWeeklyExpenses().reduce((sum, e) => sum + e.amount, 0))}
          </Text>
          <Text style={styles.progressStatLabel}>Weekly Total</Text>
        </View>
      </View>

      <View style={styles.goalProgress}>
        <Text style={styles.goalProgressTitle}>Weekly Goal Progress</Text>
        <View style={styles.goalProgressBar}>
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={[
              styles.goalProgressFill,
              {
                width: `${Math.min(
                  (getWeeklyExpenses().reduce((sum, e) => sum + e.amount, 0) / userStats.weeklyGoal) * 100,
                  100
                )}%`,
              },
            ]}
          />
        </View>
        <Text style={styles.goalProgressText}>
          {DateUtils.formatCurrency(getWeeklyExpenses().reduce((sum, e) => sum + e.amount, 0))} / {DateUtils.formatCurrency(userStats.weeklyGoal)}
        </Text>
      </View>
    </>
  );

  return (
    <GameGradientBackground type="evening">
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
              <TouchableOpacity 
                style={styles.settingsButton}
                activeOpacity={0.8}
                onPress={() => router.back()}
              >
                <PulseRing size={40} color="#FFD700">
                  <ArrowLeft size={24} color="#FFD700" />
                </PulseRing>
              </TouchableOpacity>
              <Text style={styles.title}>Adventurer Profile</Text>
              <TouchableOpacity 
                style={styles.settingsButton}
                activeOpacity={0.8}
                onPress={() => router.push('/settings')}
              >
                <PulseRing size={40} color="#FFD700">
                  <Settings size={20} color="#FFD700" />
                </PulseRing>
              </TouchableOpacity>
            </View>
          </SlideUp>

          <BounceIn>
            <ProfileCard
              userName={userName}
              level={userLevel}
              xp={userXP}
              currentStreak={userStats.currentStreak}
              totalBadges={userStats.badges.length}
            />
          </BounceIn>

          <SlideUp>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
                activeOpacity={0.85}
                onPress={() => setActiveTab('profile')}
              >
                <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>
                  Profile
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'expenses' && styles.activeTab]}
                activeOpacity={0.85}
                onPress={() => setActiveTab('expenses')}
              >
                <Text style={[styles.tabText, activeTab === 'expenses' && styles.activeTabText]}>
                  Expenses
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'progress' && styles.activeTab]}
                activeOpacity={0.85}
                onPress={() => setActiveTab('progress')}
              >
                <Text style={[styles.tabText, activeTab === 'progress' && styles.activeTabText]}>
                  Progress
                </Text>
              </TouchableOpacity>
            </View>
          </SlideUp>

          <BounceIn>
            <View style={styles.content}>
              {activeTab === 'profile' && renderProfileTab()}
              {activeTab === 'expenses' && renderExpensesTab()}
              {activeTab === 'progress' && renderProgressTab()}
            </View>
          </BounceIn>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  calendarContainer: {
    margin: 16,
    marginTop: 8,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  calendarTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
    letterSpacing: 1,
  },
  calendarPreview: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  calendarMonth: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  calendarAmount: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
    marginBottom: 4,
  },
  calendarSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  achievementsContainer: {
    margin: 16,
  },
  achievementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  achievementsList: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  moreAchievements: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFD700',
    textAlign: 'center',
  },
  noAchievements: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  noAchievementsEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  noAchievementsText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  expenseSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 16,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  expenseSummaryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 12,
    flex: 1,
  },
  expenseSummaryAmount: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  expensesList: {
    paddingHorizontal: 16,
  },
  noExpenses: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  noExpensesText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  noExpensesSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  progressSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 16,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 16,
  },
  progressStatItem: {
    alignItems: 'center',
  },
  progressStatNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  progressStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  goalProgress: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 16,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  goalProgressTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  goalProgressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginBottom: 8,
  },
  goalProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  goalProgressText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  exitButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B6B',
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 100,
  },
});