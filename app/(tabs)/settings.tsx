import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings, Tag, Plus, CreditCard as Edit3, Trash2, Save, X } from 'lucide-react-native';
import { StorageService } from '@/utils/storage';
import GameGradientBackground from '@/components/GameGradientBackground';
import FloatingElements from '@/components/FloatingElements';
import BounceIn from '@/components/BounceIn';
import SlideUp from '@/components/SlideUp';
import PulseRing from '@/components/PulseRing';

const DEFAULT_CATEGORIES = [
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

export default function SettingsScreen() {
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCategoryText, setEditCategoryText] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [weeklyGoal, setWeeklyGoal] = useState('600');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const stats = await StorageService.getUserStats();
    setWeeklyGoal(stats.weeklyGoal.toString());
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
      setShowAddCategory(false);
    }
  };

  const handleEditCategory = (category: string) => {
    setEditingCategory(category);
    setEditCategoryText(category);
  };

  const handleSaveEdit = () => {
    if (editCategoryText.trim() && !categories.includes(editCategoryText.trim())) {
      const updatedCategories = categories.map(cat => 
        cat === editingCategory ? editCategoryText.trim() : cat
      );
      setCategories(updatedCategories);
      setEditingCategory(null);
      setEditCategoryText('');
    }
  };

  const handleDeleteCategory = (category: string) => {
    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${category}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setCategories(categories.filter(cat => cat !== category));
          },
        },
      ]
    );
  };

  const handleSaveWeeklyGoal = async () => {
    const goal = parseFloat(weeklyGoal);
    if (!isNaN(goal) && goal >= 0) {
      const stats = await StorageService.getUserStats();
      await StorageService.saveUserStats({ ...stats, weeklyGoal: goal });
      Alert.alert('Success', 'Weekly goal updated successfully!');
    } else {
      Alert.alert('Error', 'Please enter a valid weekly goal amount.');
    }
  };

  return (
    <GameGradientBackground type="default">
      <FloatingElements />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <SlideUp>
            <View style={styles.header}>
              <Text style={styles.title}>Settings</Text>
            </View>
          </SlideUp>

          <BounceIn>
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>Customize your adventure</Text>
              <Text style={styles.infoSubtext}>Change categories, notifications, and more</Text>
            </View>
          </BounceIn>

          <SlideUp>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Categories</Text>
            </View>
            <View style={styles.categoriesList}>
              {categories.map((cat, idx) => (
                <BounceIn key={cat + idx}>
                  <View style={styles.categoryItem}>
                    <Text style={styles.categoryText}>{cat}</Text>
                    <View style={styles.categoryActions}>
                      <TouchableOpacity style={styles.editCategoryButton} activeOpacity={0.8} onPress={() => handleEditCategory(cat)}>
                        <Edit3 size={18} color="#FFD700" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.deleteCategoryButton} activeOpacity={0.8} onPress={() => handleDeleteCategory(cat)}>
                        <X size={18} color="#FF6B6B" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </BounceIn>
              ))}
            </View>
          </SlideUp>

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
    alignItems: 'center',
    padding: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 16,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 8,
    flex: 1,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 12,
  },
  saveGoalButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  addCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  addCategoryInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 8,
  },
  saveButton: {
    padding: 8,
    marginRight: 4,
  },
  cancelButton: {
    padding: 8,
  },
  categoriesList: {
    gap: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    flex: 1,
  },
  categoryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editCategoryButton: {
    padding: 4,
  },
  deleteCategoryButton: {
    padding: 4,
  },
  editCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  editCategoryInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 8,
  },
  infoContainer: {
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 2,
  },
  bottomSpacer: {
    height: 100,
  },
});