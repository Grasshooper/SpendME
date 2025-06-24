import React from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { ViewStyle } from 'react-native';

interface FloatProps {
  children: React.ReactNode;
  amplitude?: number;
  duration?: number;
  style?: ViewStyle;
}

export const Float: React.FC<FloatProps> = ({
  children,
  amplitude = 10,
  duration = 2000,
  style,
}) => {
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-amplitude, { duration: duration / 2 }),
        withTiming(amplitude, { duration }),
        withTiming(0, { duration: duration / 2 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
  );
};

export default Float; 