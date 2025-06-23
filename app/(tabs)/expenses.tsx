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
import { Plus, Filter } from 'lucide-react-native';
import ExpenseEntryModal from '@/components/ExpenseEntryModal';
import { StorageService } from '@/utils/storage';
import { DateUtils } from '@/utils/dateUtils';
import { Expense } from '@/types/data';

export default function ExpensesScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    const data = await StorageService.getExpenses();
    // Sort by date descending (newest first)
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

  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <View style={styles.expenseItem}>
      <View style={styles.expenseHeader}>
        <View style={styles.categoryTag}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Text style={styles.amountText}>{DateUtils.formatCurrency(item.amount)}</Text>
      </View>
      
      {item.notes && (
        <Text style={styles.notesText}>{item.notes}</Text>
      )}
      
      <View style={styles.expenseFooter}>
        <Text style={styles.dateText}>
          {new Date(item.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </Text>
        {item.isRecurring && (
          <View style={styles.recurringBadge}>
            <Text style={styles.recurringText}>Recurring</Text>
          </View>
        )}
      </View>
    </View>
  );

  const categories = ['all', 'today', 'week', ...Array.from(new Set(expenses.map(e => e.category)))];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Expenses</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowExpenseModal(true)}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

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
            <Text style={styles.emptyText}>No expenses yet</Text>
            <Text style={styles.emptySubtext}>
              Start tracking your spending by adding your first expense
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#10B981',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterChip: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipSelected: {
    backgroundColor: '#10B981',
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  filterChipTextSelected: {
    color: '#FFFFFF',
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  expenseItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTag: {
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1E40AF',
  },
  amountText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  notesText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  expenseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  recurringBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  recurringText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#D97706',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    maxWidth: 280,
  },
});