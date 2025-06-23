import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, CircleCheck as CheckCircle, Circle, Zap } from 'lucide-react-native';

interface ExpenseQuestModalProps {
  visible: boolean;
  onClose: () => void;
  questType: 'morning' | 'evening' | null;
  questions: string[];
  onComplete: (type: 'morning' | 'evening', answers: { [key: string]: boolean }) => void;
}

export default function ExpenseQuestModal({
  visible,
  onClose,
  questType,
  questions,
  onComplete,
}: ExpenseQuestModalProps) {
  const [answers, setAnswers] = useState<{ [key: string]: boolean }>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const scaleAnim = new Animated.Value(1);

  const handleAnswerToggle = (question: string) => {
    setAnswers(prev => ({
      ...prev,
      [question]: !prev[question]
    }));
  };

  const handleComplete = () => {
    if (!questType) return;

    // Animation for completion
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onComplete(questType, answers);
      setAnswers({});
    }, 1500);
  };

  const allAnswered = questions.every(q => answers[q] !== undefined);
  const xpReward = questType === 'morning' ? 50 : 100;

  if (!questType) return null;

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
        <Animated.View style={[styles.content, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.header}>
            <View style={styles.questInfo}>
              <Text style={styles.questEmoji}>
                {questType === 'morning' ? '🌅' : '🌙'}
              </Text>
              <View>
                <Text style={styles.questTitle}>
                  {questType === 'morning' ? 'Morning Quest' : 'Evening Quest'}
                </Text>
                <View style={styles.xpContainer}>
                  <Zap size={16} color="#FFD700" />
                  <Text style={styles.xpText}>+{xpReward} XP</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            {questType === 'morning' 
              ? 'Plan your spending for today' 
              : 'Reflect on your spending today'
            }
          </Text>

          <ScrollView style={styles.questionsContainer} showsVerticalScrollIndicator={false}>
            {questions.map((question, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.questionItem,
                  answers[question] !== undefined && styles.questionItemAnswered,
                ]}
                onPress={() => handleAnswerToggle(question)}
              >
                <LinearGradient
                  colors={
                    answers[question] !== undefined
                      ? ['rgba(16, 185, 129, 0.2)', 'rgba(5, 150, 105, 0.1)']
                      : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']
                  }
                  style={styles.questionGradient}
                >
                  <Text style={styles.questionText}>{question}</Text>
                  <View style={styles.answerContainer}>
                    {answers[question] !== undefined ? (
                      <CheckCircle 
                        size={24} 
                        color={answers[question] ? '#10B981' : '#EF4444'} 
                      />
                    ) : (
                      <Circle size={24} color="rgba(255, 255, 255, 0.5)" />
                    )}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={[
              styles.completeButton,
              !allAnswered && styles.completeButtonDisabled
            ]}
            onPress={handleComplete}
            disabled={!allAnswered}
          >
            <LinearGradient
              colors={allAnswered ? ['#10B981', '#059669'] : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
              style={styles.completeButtonGradient}
            >
              <Text style={[
                styles.completeButtonText,
                !allAnswered && styles.completeButtonTextDisabled
              ]}>
                Complete Quest
              </Text>
              <Zap size={20} color={allAnswered ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)'} />
            </LinearGradient>
          </TouchableOpacity>

          {showSuccess && (
            <View style={styles.successOverlay}>
              <LinearGradient
                colors={['rgba(16, 185, 129, 0.95)', 'rgba(5, 150, 105, 0.95)']}
                style={styles.successGradient}
              >
                <Text style={styles.successEmoji}>🎉</Text>
                <Text style={styles.successText}>Quest Complete!</Text>
                <Text style={styles.successSubtext}>+{xpReward} XP earned</Text>
              </LinearGradient>
            </View>
          )}
        </Animated.View>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  questInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questEmoji: {
    fontSize: 32,
    marginRight: 16,
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
    marginBottom: 24,
    textAlign: 'center',
  },
  questionsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  questionItem: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  questionItemAnswered: {
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  questionGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  questionText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 16,
  },
  answerContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  completeButtonDisabled: {
    opacity: 0.5,
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
  completeButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successGradient: {
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
  },
  successEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  successText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  successSubtext: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.9)',
  },
});