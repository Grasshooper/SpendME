import { Tabs } from 'expo-router';
import { Chrome as Home, Trophy, User, Settings } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarBackground: () => (
          <LinearGradient
            colors={['rgba(139, 69, 255, 0.95)', 'rgba(88, 28, 135, 0.95)']}
            style={StyleSheet.absoluteFillObject}
          />
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Adventure',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: 'Rewards',
          tabBarIcon: ({ size, color }) => (
            <Trophy size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 0,
    elevation: 0,
    height: 85,
    paddingTop: 8,
    paddingBottom: 12,
  },
  tabBarLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
    marginTop: 4,
  },
});