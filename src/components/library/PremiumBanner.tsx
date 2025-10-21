import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface PremiumBannerProps {
  onPress: () => void;
  onDismiss: () => void;
}

export function PremiumBanner({ onPress, onDismiss }: PremiumBannerProps) {
  return (
    <View className="px-5 mb-4">
      <View className="rounded-2xl overflow-hidden shadow-sm">
        <LinearGradient
          colors={['#3B82F6', '#2563EB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ padding: 24 }}
        >
          {/* Decorative background elements */}
          <View className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full" />
          <View className="absolute -left-2 -bottom-2 w-16 h-16 bg-white/10 rounded-full" />

        {/* Close button */}
        <TouchableOpacity
          onPress={onDismiss}
          className="absolute top-3 right-3 w-8 h-8 items-center justify-center bg-white/20 rounded-full"
          activeOpacity={0.8}
        >
          <IconSymbol name="xmark" size={14} color="#FFF" />
        </TouchableOpacity>

        {/* Content */}
        <View className="flex-row items-center mb-3">
          <View className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center mr-3">
            <IconSymbol name="sparkles" size={24} color="#FFF" />
          </View>
          <View className="flex-1 pr-8">
            <Text className="text-xl font-bold text-white mb-1">
              Unlock Premium
            </Text>
            <Text className="text-sm text-white/90">
              Access all 102 principles
            </Text>
          </View>
        </View>

        <Text className="text-sm text-white/90 mb-4 leading-5">
          Get 72 additional UX laws, patterns, and cognitive biases. Complete quiz library and all future updates.
        </Text>

        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.8}
        >
          <View className="bg-white rounded-xl py-3 px-4 flex-row items-center justify-center">
            <Text className="text-blue-600 text-base font-semibold mr-2">
              Only $2.99 · One-time
            </Text>
            <IconSymbol name="arrow.right" size={16} color="#2563EB" />
          </View>
        </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
}
