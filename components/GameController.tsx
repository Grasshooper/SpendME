import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming,
  interpolate
} from 'react-native-reanimated';

export default function GameController() {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    // Gentle floating animation
    rotation.value = withRepeat(
      withSequence(
        withTiming(5, { duration: 2000 }),
        withTiming(-5, { duration: 2000 })
      ),
      -1,
      true
    );

    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500 }),
        withTiming(0.95, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value }
    ],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.controller}>
        {/* Controller body */}
        <View style={styles.controllerBody} />
        
        {/* D-pad */}
        <View style={styles.dpad}>
          <View style={styles.dpadVertical} />
          <View style={styles.dpadHorizontal} />
        </View>
        
        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <View style={[styles.actionButton, styles.buttonY]} />
          <View style={[styles.actionButton, styles.buttonX]} />
          <View style={[styles.actionButton, styles.buttonA]} />
          <View style={[styles.actionButton, styles.buttonB]} />
        </View>
        
        {/* Analog sticks */}
        <View style={[styles.analogStick, styles.leftStick]} />
        <View style={[styles.analogStick, styles.rightStick]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  controller: {
    width: 120,
    height: 80,
    position: 'relative',
  },
  controllerBody: {
    width: '100%',
    height: '100%',
    backgroundColor: '#6B46C1',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  dpad: {
    position: 'absolute',
    left: 15,
    top: 25,
    width: 20,
    height: 20,
  },
  dpadVertical: {
    position: 'absolute',
    left: 7,
    top: 0,
    width: 6,
    height: 20,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  dpadHorizontal: {
    position: 'absolute',
    left: 0,
    top: 7,
    width: 20,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  actionButtons: {
    position: 'absolute',
    right: 15,
    top: 20,
    width: 30,
    height: 30,
  },
  actionButton: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  buttonY: {
    backgroundColor: '#FBBF24',
    top: 0,
    left: 11,
  },
  buttonX: {
    backgroundColor: '#3B82F6',
    top: 11,
    left: 0,
  },
  buttonA: {
    backgroundColor: '#10B981',
    top: 11,
    right: 0,
  },
  buttonB: {
    backgroundColor: '#EF4444',
    bottom: 0,
    left: 11,
  },
  analogStick: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: '#9CA3AF',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  leftStick: {
    left: 20,
    bottom: 8,
  },
  rightStick: {
    right: 20,
    bottom: 8,
  },
});