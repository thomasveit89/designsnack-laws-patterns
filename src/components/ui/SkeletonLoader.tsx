import React from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  className?: string;
}

export function Skeleton({ width = '100%', height = 20, borderRadius = 8, className = '' }: SkeletonProps) {
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 1000 }),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(opacity.value, [0.3, 1], [0.3, 0.7]),
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: '#E5E7EB',
        },
        animatedStyle,
      ]}
      className={className}
    />
  );
}

export function PrincipleCardSkeleton() {
  return (
    <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-3">
      <View className="flex-row items-start mb-3">
        <Skeleton width={40} height={40} borderRadius={20} className="mr-4" />
        <View className="flex-1">
          <Skeleton width="80%" height={20} className="mb-2" />
          <Skeleton width="60%" height={16} />
        </View>
      </View>
      <Skeleton width="100%" height={16} className="mb-2" />
      <Skeleton width="90%" height={16} className="mb-4" />

      <View className="flex-row items-center justify-between">
        <Skeleton width={80} height={24} borderRadius={12} />
        <Skeleton width={24} height={24} borderRadius={12} />
      </View>
    </View>
  );
}

export function LoadingSkeletons({ count = 6 }: { count?: number }) {
  return (
    <View className="space-y-3">
      {Array.from({ length: count }, (_, i) => (
        <PrincipleCardSkeleton key={i} />
      ))}
    </View>
  );
}