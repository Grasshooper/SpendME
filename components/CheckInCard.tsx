import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { CheckCircle, Circle, Sparkles } from 'lucide-react-native';
import { CheckIn } from '@/types/data';

interface CheckInCardProps {
  type: 'morning' | 'evening';
  questions: string[];
  onComplete: (answers: { [key: string]: boolean }) => void;
  isCompleted: boolean;
  existingAnswers?: { [key: string]: boolean };
}

export default function CheckInCard({ 
  type, 
  questions, 
  onComplete, 
  isCompleted, 
  existingAnswers = {} 
}: CheckInCardProps) {
  const [answers, setAnswers] = useState<{ [key: string]: boolean }>(existingAnswers);
  const [showSuccess, setShowSuccess] = useState(false);
  const scaleAnim = new Animated.Value(1);

  const handleAnswerToggle = (question: string) => {
    if (isCompleted) return;
    
    setAnswers(prev => ({
      ...prev,
      [question]: !prev[question]
    }));
  };

  const handleComplete = () => {
    if (isCompleted) return;
    
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
    setTimeout(() => setShowSuccess(false), 2000);
    
    onComplete(answers);
  };

  const allAnswered = questions.every(q => answers[q] !== undefined);
  const cardColor = type === 'morning' ? '#FEF3C7' : '#E0E7FF';
  const accentColor = type === 'morning' ? '#F59E0B' : '#8B5CF6';

  return (
    <Animated.View style={[styles.container, { backgroundColor: cardColor, transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.header}>
        <View style={[styles.typeIndicator, { backgroundColor: accentColor }]}>
          <Text style={styles.typeText}>
            {type === 'morning' ? '🌅' : '🌙'} {type.charAt(0).toUpperCase() + type.slice(1)}
          </Text>
        </View>
        {isCompleted && (
          <View style={styles.completedBadge}>
            <Sparkles size={16} color="#10B981" />
            <Text style={styles.completedText}>Done!</Text>
          </View>
        )}
      </View>

      <Text style={styles.title}>
        {type === 'morning' 
          ? 'Morning Check-in' 
          : 'Evening Review'
        }
      </Text>

      <Text style={styles.subtitle}>
        {type === 'morning' 
          ? 'Are you planning to spend on these today?' 
          : 'Did you spend on these today?'
        }
      </Text>

      <View style={styles.questionsContainer}>
        {questions.map((question, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.questionItem,
              answers[question] && styles.questionItemSelected,
              isCompleted && styles.questionItemDisabled
            ]}
            onPress={() => handleAnswerToggle(question)}
            disabled={isCompleted}
          >
            <View style={styles.questionContent}>
              <Text style={[
                styles.questionText,
                answers[question] && styles.questionTextSelected
              ]}>
                {question}
              </Text>
              {answers[question] !== undefined ? (
                <CheckCircle 
                  size={20} 
                  color={answers[question] ? '#10B981' : '#EF4444'} 
                />
              ) : (
                <Circle size={20} color="#9CA3AF" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {!isCompleted && (
        <TouchableOpacity
          style={[
            styles.completeButton,
            { backgroundColor: accentColor },
            !allAnswered && styles.completeButtonDisabled
          ]}
          onPress={handleComplete}
          disabled={!allAnswered}
        >
          <Text style={styles.completeButtonText}>
            Complete {type} Check-in
          </Text>
        </TouchableOpacity>
      )}

      {showSuccess && (
        <View style={styles.successOverlay}>
          <Text style={styles.successText}>Great job! 🎉</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    margin: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  typeText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedText: {
    color: '#10B981',
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    marginLeft: 4,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
  },
  questionsContainer: {
    marginBottom: 16,
  },
  questionItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  questionItemSelected: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  questionItemDisabled: {
    opacity: 0.7,
  },
  questionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    flex: 1,
    marginRight: 12,
  },
  questionTextSelected: {
    color: '#059669',
  },
  completeButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  completeButtonDisabled: {
    opacity: 0.5,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
});