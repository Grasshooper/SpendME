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
import { X, DollarSign, Zap, Chrome as Home } from 'lucide-react-native';

interface MorningQuestModalProps {
  visible: boolean;
  onClose: () => void;
  utilities: string[];
  onComplete: (utilities: { [key: string]: number }) => void;
}

export default function MorningQuestModal({
  visible,
  onClose,
  utilities,
  onComplete,
}: MorningQuestModalProps) {
  const [utilityAmounts, setUtilityAmounts] = useState<{ [key: string]: string }>({});

  const handleAmountChange = (utility: string, amount: string) => {
    setUtilityAmounts(prev => ({
      ...prev,
      [utility]: amount,
    }));
  };

  const handleComplete = () => {
    const amounts: { [key: string]: number } = {};
    let hasValidAmount = false;

    for (const [utility, amountStr] of Object.entries(utilityAmounts)) {
      const amount = parseFloat(amountStr) || 0;
      amounts[utility] = amount;
      if (amount > 0) hasValidAmount = true;
    }

    if (!hasValidAmount) {
      Alert.alert('No Amounts', 'Please enter at least one utility amount.');
      return;
    }

    onComplete(amounts);
    setUtilityAmounts({});
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
            <Home size={32} color="#FFD700" />
            <View style={styles.questTextContainer}>
              <Text style={styles.questTitle}>Morning Quest</Text>
              <View style={styles.xpContainer}>
                <Zap size={16} color="#FFD700" />
                <Text style={styles.xpText}>+50 XP</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          Log your monthly bills and utility payments
        </Text>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.instructionText}>
            Enter the amounts for any bills or utilities you're paying this month:
          </Text>

          {utilities.map((utility) => (
            <View key={utility} style={styles.utilityItem}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                style={styles.utilityGradient}
              >
                <Text style={styles.utilityName}>{utility}</Text>
                <View style={styles.inputContainer}>
                  <DollarSign size={20} color="rgba(255, 255, 255, 0.7)" />
                  <TextInput
                    style={styles.amountInput}
                    value={utilityAmounts[utility] || ''}
                    onChangeText={(amount) => handleAmountChange(utility, amount)}
                    placeholder="0.00"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    keyboardType="decimal-pad"
                  />
                </View>
              </LinearGradient>
            </View>
          ))}
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
  utilityItem: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  utilityGradient: {
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  utilityName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 12,
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
  },
  amountInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    marginLeft: 12,
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