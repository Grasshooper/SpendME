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
import { Settings, Tag, Plus, CreditCard as Edit3, Trash2, Save, X, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { StorageService } from '@/utils/storage';

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
    <LinearGradient
      colors={['#8B45FF', '#581C87', '#3B0764']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Weekly Goal Setting */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weekly Goal</Text>
            <View style={styles.goalContainer}>
              <TextInput
                style={styles.goalInput}
                value={weeklyGoal}
                onChangeText={setWeeklyGoal}
                placeholder="Enter weekly goal"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                keyboardType="decimal-pad"
              />
              <TouchableOpacity style={styles.saveGoalButton} onPress={handleSaveWeeklyGoal}>
                <Save size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Notifications Setting */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <View style={styles.notificationContainer}>
              <Text style={styles.notificationText}>Daily Quest Reminders</Text>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: 'rgba(255, 255, 255, 0.2)', true: '#10B981' }}
                thumbColor={notifications ? '#FFFFFF' : 'rgba(255, 255, 255, 0.8)'}
              />
            </View>
          </View>

          {/* Manage Categories */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Tag size={20} color="#FFFFFF" />
              <Text style={styles.sectionTitle}>Manage Categories</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddCategory(true)}
              >
                <Plus size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {showAddCategory && (
              <View style={styles.addCategoryContainer}>
                <TextInput
                  style={styles.addCategoryInput}
                  value={newCategory}
                  onChangeText={setNewCategory}
                  placeholder="Enter new category"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                />
                <TouchableOpacity style={styles.saveButton} onPress={handleAddCategory}>
                  <Save size={16} color="#10B981" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowAddCategory(false);
                    setNewCategory('');
                  }}
                >
                  <X size={16} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.categoriesList}>
              {categories.map((category, index) => (
                <View key={category} style={styles.categoryItem}>
                  {editingCategory === category ? (
                    <View style={styles.editCategoryContainer}>
                      <TextInput
                        style={styles.editCategoryInput}
                        value={editCategoryText}
                        onChangeText={setEditCategoryText}
                        placeholder="Category name"
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      />
                      <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
                        <Save size={16} color="#10B981" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => {
                          setEditingCategory(null);
                          setEditCategoryText('');
                        }}
                      >
                        <X size={16} color="#FF6B6B" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <>
                      <Text style={styles.categoryText}>{category}</Text>
                      <View style={styles.categoryActions}>
                        <TouchableOpacity
                          style={styles.editCategoryButton}
                          onPress={() => handleEditCategory(category)}
                        >
                          <Edit3 size={16} color="rgba(255, 255, 255, 0.7)" />
                        </TouchableOpacity>
                        {!DEFAULT_CATEGORIES.includes(category) && (
                          <TouchableOpacity
                            style={styles.deleteCategoryButton}
                            onPress={() => handleDeleteCategory(category)}
                          >
                            <Trash2 size={16} color="#FF6B6B" />
                          </TouchableOpacity>
                        )}
                      </View>
                    </>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* App Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>Spendy-Budget Tracker</Text>
              <Text style={styles.infoSubtext}>Version 1.0.0</Text>
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
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