import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, DollarSign, Tag, FileText, Repeat } from 'lucide-react-native';
import { Expense } from '@/types/data';

interface ExpenseEntryModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (expense: Omit<Expense, 'id' | 'date'>) => void;
}

const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Personal Care',
  'Other',
];

export default function ExpenseEntryModal({ visible, onClose, onSave }: ExpenseEntryModalProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

  const handleSave = () => {
    if (!amount || !category) {
      Alert.alert('Missing Information', 'Please enter both amount and category.');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid positive amount.');
      return;
    }

    onSave({
      amount: numericAmount,
      category,
      notes,
      isRecurring,
    });

    // Reset form
    setAmount('');
    setCategory('');
    setNotes('');
    setIsRecurring(false);
    onClose();
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
          <Text style={styles.title}>Add Quest Expense</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Amount Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.inputContainer}>
              <DollarSign size={20} color="rgba(255, 255, 255, 0.7)" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                keyboardType="decimal-pad"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
              />
            </View>
          </View>

          {/* Category Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    category === cat && styles.categoryChipSelected,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      category === cat && styles.categoryChipTextSelected,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Notes Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <View style={styles.inputContainer}>
              <FileText size={20} color="rgba(255, 255, 255, 0.7)" style={styles.inputIcon} />
              <TextInput
                style={[styles.textInput, styles.notesInput]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Add a note about this expense..."
                multiline
                numberOfLines={3}
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
              />
            </View>
          </View>

          {/* Recurring Toggle */}
          <TouchableOpacity
            style={styles.recurringToggle}
            onPress={() => setIsRecurring(!isRecurring)}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
              style={styles.recurringToggleGradient}
            >
              <View style={styles.recurringToggleContent}>
                <View style={styles.recurringInfo}>
                  <Repeat size={20} color="rgba(255, 255, 255, 0.8)" />
                  <View style={styles.recurringTextContainer}>
                    <Text style={styles.recurringTitle}>Recurring Expense</Text>
                    <Text style={styles.recurringSubtitle}>
                      This expense happens regularly
                    </Text>
                  </View>
                </View>
                <View style={[
                  styles.toggleSwitch,
                  isRecurring && styles.toggleSwitchActive,
                ]}>
                  <View style={[
                    styles.toggleKnob,
                    isRecurring && styles.toggleKnobActive,
                  ]} />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>

        {/* Save Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              (!amount || !category) && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!amount || !category}
          >
            <LinearGradient
              colors={
                amount && category 
                  ? ['#10B981', '#059669'] 
                  : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']
              }
              style={styles.saveButtonGradient}
            >
              <Text style={[
                styles.saveButtonText,
                (!amount || !category) && styles.saveButtonTextDisabled
              ]}>
                Add Expense
              </Text>
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
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  categoryScroll: {
    flexGrow: 0,
  },
  categoryChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryChipSelected: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  categoryChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  categoryChipTextSelected: {
    color: '#1F2937',
  },
  recurringToggle: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  recurringToggleGradient: {
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  recurringToggleContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recurringInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recurringTextContainer: {
    marginLeft: 12,
  },
  recurringTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  recurringSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  toggleSwitch: {
    width: 50,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 14,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleSwitchActive: {
    backgroundColor: '#10B981',
  },
  toggleKnob: {
    width: 24,
    height: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleKnobActive: {
    alignSelf: 'flex-end',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  saveButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
});