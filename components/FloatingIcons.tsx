import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming,
  withDelay
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const icons = ['⭐', '☀️', '✨'];

interface FloatingIconProps {
  icon: string;
  delay: number;
  x: number;
  y: number;
}

function FloatingIcon({ icon, delay, x, y }: FloatingIconProps) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.7);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-15, { duration: 2000 }),
          withTiming(15, { duration: 2000 })
        ),
        -1,
        true
      )
    );

    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.9, { duration: 1500 }),
          withTiming(0.5, { duration: 1500 })
        ),
        -1,
        true
      )
    );

    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.2, { duration: 1800 }),
          withTiming(0.8, { duration: 1800 })
        ),
        -1,
        true
      )
    );
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value }
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text 
      style={[
        styles.floatingIcon, 
        { left: x, top: y },
        animatedStyle
      ]}
    >
      {icon}
    </Animated.Text>
  );
}

export default function FloatingIcons() {
  const iconPositions = React.useMemo(() => {
    return icons.map((icon, index) => ({
      icon,
      delay: index * 500,
      x: Math.random() * (width - 50),
      y: Math.random() * (height - 200) + 100,
    }));
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {iconPositions.map((props, index) => (
        <FloatingIcon key={index} {...props} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  floatingIcon: {
    position: 'absolute',
    fontSize: 24,
  },
});