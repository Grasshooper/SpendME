import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, DollarSign, Zap, Moon, Plus, Trash2 } from 'lucide-react-native';

interface ExpenseEntry {
  category: string;
  amount: string;
  notes: string;
}

interface EveningQuestModalProps {
  visible: boolean;
  onClose: () => void;
  categories: string[];
  onComplete: (expenses: { category: string; amount: number; notes: string }[]) => void;
}

export default function EveningQuestModal({
  visible,
  onClose,
  categories,
  onComplete,
}: EveningQuestModalProps) {
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([
    { category: '', amount: '', notes: '' }
  ]);

  const addExpenseEntry = () => {
    setExpenses([...expenses, { category: '', amount: '', notes: '' }]);
  };

  const removeExpenseEntry = (index: number) => {
    if (expenses.length > 1) {
      setExpenses(expenses.filter((_, i) => i !== index));
    }
  };

  const updateExpense = (index: number, field: keyof ExpenseEntry, value: string) => {
    const updated = [...expenses];
    updated[index][field] = value;
    setExpenses(updated);
  };

  const handleComplete = () => {
    const validExpenses = expenses
      .filter(expense => expense.category && expense.amount && parseFloat(expense.amount) > 0)
      .map(expense => ({
        category: expense.category,
        amount: parseFloat(expense.amount),
        notes: expense.notes,
      }));

    if (validExpenses.length === 0) {
      Alert.alert('No Expenses', 'Please add at least one expense with a category and amount.');
      return;
    }

    onComplete(validExpenses);
    setExpenses([{ category: '', amount: '', notes: '' }]);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <LinearGradient
        colors={['#8B45FF', '#581C87', '#3B0764']}
        style={styles.container}
      >
        <View style={styles.header}>
          <View style={styles.questInfo}>
            <Moon size={32} color="#FFD700" />
            <View style={styles.questTextContainer}>
              <Text style={styles.questTitle}>Evening Quest</Text>
              <View style={styles.xpContainer}>
                <Zap size={16} color="#FFD700" />
                <Text style={styles.xpText}>+100 XP</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          Log what you spent today
        </Text>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.instructionText}>
            Add your expenses from today:
          </Text>

          {expenses.map((expense, index) => (
            <View key={index} style={styles.expenseItem}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                style={styles.expenseGradient}
              >
                <View style={styles.expenseHeader}>
                  <Text style={styles.expenseTitle}>Expense {index + 1}</Text>
                  {expenses.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeExpenseEntry(index)}
                    >
                      <Trash2 size={16} color="#FF6B6B" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Category Selection */}
                <Text style={styles.fieldLabel}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryChip,
                        expense.category === category && styles.categoryChipSelected,
                      ]}
                      onPress={() => updateExpense(index, 'category', category)}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          expense.category === category && styles.categoryChipTextSelected,
                        ]}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Amount Input */}
                <Text style={styles.fieldLabel}>Amount</Text>
                <View style={styles.inputContainer}>
                  <DollarSign size={20} color="rgba(255, 255, 255, 0.7)" />
                  <TextInput
                    style={styles.amountInput}
                    value={expense.amount}
                    onChangeText={(amount) => updateExpense(index, 'amount', amount)}
                    placeholder="0.00"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    keyboardType="decimal-pad"
                  />
                </View>

                {/* Notes Input */}
                <Text style={styles.fieldLabel}>Notes (Optional)</Text>
                <TextInput
                  style={styles.notesInput}
                  value={expense.notes}
                  onChangeText={(notes) => updateExpense(index, 'notes', notes)}
                  placeholder="Add a note..."
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  multiline
                  numberOfLines={2}
                />
              </LinearGradient>
            </View>
          ))}

          <TouchableOpacity style={styles.addExpenseButton} onPress={addExpenseEntry}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
              style={styles.addExpenseGradient}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.addExpenseText}>Add Another Expense</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.completeButtonGradient}
            >
              <Text style={styles.completeButtonText}>Complete Quest</Text>
              <Zap size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  questInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questTextContainer: {
    marginLeft: 16,
  },
  questTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  xpText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFD700',
    marginLeft: 4,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    padding: 20,
    paddingBottom: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  instructionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
    textAlign: 'center',
  },
  expenseItem: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  expenseGradient: {
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  expenseTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  removeButton: {
    padding: 4,
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
    marginTop: 8,
  },
  categoryScroll: {
    marginBottom: 12,
  },
  categoryChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryChipSelected: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  categoryChipText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  categoryChipTextSelected: {
    color: '#1F2937',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 12,
  },
  amountInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  notesInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    textAlignVertical: 'top',
  },
  addExpenseButton: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  addExpenseGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderStyle: 'dashed',
  },
  addExpenseText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  completeButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  completeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  completeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
});