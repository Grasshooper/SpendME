import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GameGradientBackgroundProps {
  type?: 'morning' | 'evening' | 'default';
  style?: ViewStyle;
  children?: React.ReactNode;
}

const gradients = {
  morning: ['#FFA726', '#FFD54F'],
  evening: ['#8B45FF', '#581C87', '#3B0764'],
  default: ['#232526', '#414345'],
};

export const GameGradientBackground: React.FC<GameGradientBackgroundProps> = ({
  type = 'default',
  style,
  children,
}) => {
  return (
    <LinearGradient
      colors={gradients[type] || gradients.default}
      style={[StyleSheet.absoluteFill, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
};

export default GameGradientBackground;
 