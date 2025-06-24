import React from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { ViewStyle } from 'react-native';

interface SlideUpProps {
  children: React.ReactNode;
  offset?: number;
  duration?: number;
  style?: ViewStyle;
}

export const SlideUp: React.FC<SlideUpProps> = ({ children, offset = 40, duration = 600, style }) => {
  const translateY = useSharedValue(offset);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    translateY.value = withTiming(0, { duration });
    opacity.value = withTiming(1, { duration });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
};

export default SlideUp; 