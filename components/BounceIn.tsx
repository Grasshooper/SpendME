import React from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming, runOnJS } from 'react-native-reanimated';
import { ViewStyle } from 'react-native';

interface BounceInProps {
  children: React.ReactNode;
  duration?: number;
  style?: ViewStyle;
  onFinish?: () => void;
}

export const BounceIn: React.FC<BounceInProps> = ({ children, duration = 700, style, onFinish }) => {
  const scale = useSharedValue(0.5);

  React.useEffect(() => {
    scale.value = withSequence(
      withTiming(1.15, { duration: duration * 0.5 }),
      withTiming(0.95, { duration: duration * 0.2 }),
      withTiming(1, { duration: duration * 0.3 }, (finished) => {
        if (finished && onFinish) runOnJS(onFinish)();
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
};

export default BounceIn; 