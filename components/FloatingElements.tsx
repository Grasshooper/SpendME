import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Float from './Float';

const { width, height } = Dimensions.get('window');

const ELEMENTS = [
  { emoji: '💰', count: 3 },
  { emoji: '⭐', count: 3 },
];

function getRandomPosition() {
  return {
    left: Math.random() * (width - 40),
    top: Math.random() * (height - 200),
    delay: Math.random() * 2000,
    amplitude: 8 + Math.random() * 10,
  };
}

export const FloatingElements: React.FC = () => {
  const elements = React.useMemo(() => {
    let arr: any[] = [];
    ELEMENTS.forEach(({ emoji, count }) => {
      for (let i = 0; i < count; i++) {
        arr.push({ emoji, ...getRandomPosition(), key: `${emoji}-${i}` });
      }
    });
    return arr;
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {elements.map(({ emoji, left, top, delay, amplitude, key }) => (
        <Float key={key} amplitude={amplitude} style={{ position: 'absolute', left, top }}>
          <View style={{ opacity: 0.7 }}>
            <Float amplitude={2} style={{}}>{emoji}</Float>
          </View>
        </Float>
      ))}
    </View>
  );
};

export default FloatingElements; 