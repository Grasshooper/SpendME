import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';

interface PulseRingProps {
  children: React.ReactNode;
  color?: string;
  size?: number;
  ringWidth?: number;
  duration?: number;
  style?: ViewStyle;
}

export const PulseRing: React.FC<PulseRingProps> = ({
  children,
  color = '#FFD700',
  size = 64,
  ringWidth = 6,
  duration = 1200,
  style,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.7);

  React.useEffect(() => {
    scale.value = withRepeat(withTiming(1.6, { duration }), -1, true);
    opacity.value = withRepeat(withTiming(0, { duration }), -1, true);
  }, []);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
      <Animated.View
        style={[
          styles.ring,
          {
            borderColor: color,
            width: size,
            height: size,
            borderWidth: ringWidth,
            borderRadius: size / 2,
          },
          ringStyle,
        ]}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  ring: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PulseRing; 