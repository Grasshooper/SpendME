import React from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { ViewStyle } from 'react-native';

interface SparkleProps {
  children: React.ReactNode;
  duration?: number;
  style?: ViewStyle;
}

export const Sparkle: React.FC<SparkleProps> = ({ children, duration = 1200, style }) => {
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    rotate.value = withRepeat(withTiming(360, { duration }), -1, false);
    scale.value = withRepeat(
      withTiming(1.3, { duration: duration / 2 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
  }));

  return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
};

export default Sparkle; 