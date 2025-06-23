import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Calendar, DollarSign } from 'lucide-react-native';
import ExpenseEntryModal from '@/components/ExpenseEntryModal';
import ExpenseCard from '@/components/ExpenseCard';
import WeeklySummaryCard from '@/components/WeeklySummaryCard';
import { StorageService } from '@/utils/storage';
import { DateUtils } from '@/utils/dateUtils';
import { Expense } from '@/types/data';

export default function QuestsScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    const data = await StorageService.getExpenses();
    const sorted = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setExpenses(sorted);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadExpenses();
    setRefreshing(false);
  };

  const handleExpenseSave = async (expenseData: Omit<Expense, 'id' | 'date'>) => {
    const expense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
      date: DateUtils.getTodayString(),
    };

    await StorageService.saveExpense(expense);
    await loadExpenses();
  };

  const getFilteredExpenses = () => {
    if (selectedFilter === 'all') return expenses;
    
    if (selectedFilter === 'today') {
      const today = DateUtils.getTodayString();
      return expenses.filter(e => e.date === today);
    }
    
    if (selectedFilter === 'week') {
      const weekStart = DateUtils.getWeekStart();
      return expenses.filter(e => new Date(e.date) >= weekStart);
    }

    return expenses.filter(e => e.category === selectedFilter);
  };

  const getTotalAmount = () => {
    return getFilteredExpenses().reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getWeeklyExpenses = () => {
    const weekStart = DateUtils.getWeekStart();
    return expenses.filter(e => new Date(e.date) >= weekStart);
  };

  const categories = ['all', 'today', 'week', ...Array.from(new Set(expenses.map(e => e.category)))];

  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <ExpenseCard expense={item} />
  );

  return (
    <LinearGradient
      colors={['#8B45FF', '#581C87', '#3B0764']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Quest Log</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowExpenseModal(true)}
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <WeeklySummaryCard 
          expenses={getWeeklyExpenses()}
          weeklyGoal={600}
        />

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <FlatList
            horizontal
            data={categories}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  selectedFilter === item && styles.filterChipSelected,
                ]}
                onPress={() => setSelectedFilter(item)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedFilter === item && styles.filterChipTextSelected,
                  ]}
                >
                  {item === 'all' ? 'All' : 
                   item === 'today' ? 'Today' : 
                   item === 'week' ? 'This Week' : item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Summary */}
        <View style={styles.summaryContainer}>
          <DollarSign size={20} color="#10B981" />
          <Text style={styles.summaryLabel}>
            Total {selectedFilter === 'all' ? '' : 
                  selectedFilter === 'today' ? 'Today' : 
                  selectedFilter === 'week' ? 'This Week' : selectedFilter}
          </Text>
          <Text style={styles.summaryAmount}>
            {DateUtils.formatCurrency(getTotalAmount())}
          </Text>
        </View>

        {/* Expenses List */}
        <FlatList
          data={getFilteredExpenses()}
          keyExtractor={(item) => item.id}
          renderItem={renderExpenseItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No quests completed yet</Text>
              <Text style={styles.emptySubtext}>
                Start your adventure by logging your first expense
              </Text>
            </View>
          }
        />

        <ExpenseEntryModal
          visible={showExpenseModal}
          onClose={() => setShowExpenseModal(false)}
          onSave={handleExpenseSave}
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
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterChipSelected: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  filterChipTextSelected: {
    color: '#1F2937',
  },
  summaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 8,
    flex: 1,
  },
  summaryAmount: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    maxWidth: 280,
  },
});