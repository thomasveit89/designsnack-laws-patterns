import React, { useState, forwardRef, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  interpolate,
  runOnJS
} from 'react-native-reanimated';
import { Principle } from '../../data/types';
import { CategoryChip } from '../shared/CategoryChip';
import { getPrincipleImage } from '../../lib/image-placeholders';
import { getTypeLabel } from '../../lib/utils';
import * as Haptics from 'expo-haptics';

interface FlashCardProps {
  principle: Principle;
  className?: string;
  resetTrigger?: number; // Add a reset trigger prop
}

export const FlashCard = forwardRef<View, FlashCardProps>(({ principle, className, resetTrigger }, ref) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnimation = useSharedValue(0);
  const emoji = getPrincipleImage(principle.id);

  // Reset card to front when resetTrigger changes
  useEffect(() => {
    if (resetTrigger !== undefined && isFlipped) {
      setIsFlipped(false);
      flipAnimation.value = withTiming(0, { duration: 0 });
    }
  }, [resetTrigger, isFlipped, flipAnimation]);

  const handleFlip = () => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Animate flip
    flipAnimation.value = withTiming(isFlipped ? 0 : 1, { duration: 600 }, () => {
      runOnJS(setIsFlipped)(!isFlipped);
    });
  };

  // Front side animation (0 degrees -> 90 degrees)
  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipAnimation.value, [0, 1], [0, 90]);
    const opacity = interpolate(flipAnimation.value, [0, 0.5, 1], [1, 0, 0]);
    
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity,
      backfaceVisibility: 'hidden',
    };
  });

  // Back side animation (270 degrees -> 360 degrees)
  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipAnimation.value, [0, 1], [90, 0]);
    const opacity = interpolate(flipAnimation.value, [0, 0.5, 1], [0, 0, 1]);
    
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity,
      backfaceVisibility: 'hidden',
    };
  });

  return (
    <TouchableOpacity 
      ref={ref}
      onPress={handleFlip}
      activeOpacity={0.9}
      className={`relative ${className}`}
    >
      {/* Front Side */}
      <Animated.View 
        style={[frontAnimatedStyle]}
        className="absolute inset-0 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <View className="flex-1 items-center justify-center">
          {/* Emoji */}
          <Text 
            className="text-6xl mb-4"
            style={{ lineHeight: 72, includeFontPadding: false }}
          >
            {emoji}
          </Text>
          
          {/* Title */}
          <Text className="text-2xl font-bold text-gray-900 text-center mb-4">
            {principle.title}
          </Text>
          
          {/* Type Badge */}
          <View className="bg-brand-primary/10 px-3 py-1.5 rounded-full mb-6">
            <Text className="text-sm font-medium text-brand-primary">
              {getTypeLabel(principle.type)}
            </Text>
          </View>

          {/* Flip Hint */}
          <View className="flex-row items-center">
            <Text className="text-base text-gray-500 mr-2">
              Tap to reveal
            </Text>
            <Text className="text-lg">🔄</Text>
          </View>
        </View>
      </Animated.View>

      {/* Back Side */}
      <Animated.View 
        style={[backAnimatedStyle]}
        className="absolute inset-0 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <View className="flex-1">
          {/* Header */}
          <View className="items-center mb-6">
            <Text className="text-xl font-bold text-gray-900 text-center mb-2">
              {principle.title}
            </Text>
            <CategoryChip 
              category={principle.category}
              size="sm"
            />
          </View>

          {/* One-liner */}
          <View className="bg-blue-50 rounded-xl p-4 mb-6">
            <Text className="text-lg font-semibold text-blue-900 text-center">
              {principle.oneLiner}
            </Text>
          </View>

          {/* Definition */}
          <Text className="text-base text-gray-700 leading-relaxed mb-6 flex-1">
            {principle.definition}
          </Text>

          {/* Quick Do */}
          {principle.do.length > 0 && (
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-900 mb-2">
                ✅ Key Points:
              </Text>
              <View>
                {principle.do.slice(0, 2).map((item, index) => (
                  <Text key={index} className="text-sm text-gray-600 mb-1">
                    • {item}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* Flip Hint */}
          <View className="flex-row items-center justify-center">
            <Text className="text-sm text-gray-500 mr-2">
              Tap to flip back
            </Text>
            <Text className="text-base">🔄</Text>
          </View>
        </View>
      </Animated.View>

      {/* Spacer to maintain height */}
      <View className="bg-transparent rounded-2xl p-6 min-h-[500]" />
    </TouchableOpacity>
  );
});