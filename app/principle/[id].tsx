import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { usePrinciples } from '@/src/store/usePrinciples';
import { FavoriteButton } from '@/src/components/shared/FavoriteButton';
import { CategoryChip } from '@/src/components/shared/CategoryChip';
import { Button } from '@/src/components/ui/Button';
import { getPrincipleEmoji } from '@/src/lib/image-placeholders';
import { getTypeLabel } from '@/src/lib/utils';
import { Principle } from '@/src/data/types';

export default function PrincipleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { principles, loadPrinciples } = usePrinciples();
  const [principle, setPrinciple] = useState<Principle | null>(null);

  useEffect(() => {
    loadPrinciples();
  }, [loadPrinciples]);

  useEffect(() => {
    if (principles.length > 0 && id) {
      const found = principles.find(p => p.id === id);
      setPrinciple(found || null);
    }
  }, [principles, id]);

  if (!principle) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">Loading principle...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const emoji = getPrincipleEmoji(principle.title);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="flex-row items-center"
        >
          <Text className="text-2xl mr-2">←</Text>
          <Text className="text-lg font-medium text-gray-700">Back</Text>
        </TouchableOpacity>
        <FavoriteButton 
          principleId={principle.id}
          size="md"
        />
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Hero Section */}
        <View className="bg-white px-6 py-8 mb-6">
          {/* Emoji */}
          <View className="items-center mb-6">
            <Text 
              className="text-8xl mb-4"
              style={{ lineHeight: 120, includeFontPadding: false }}
            >
              {emoji}
            </Text>
          </View>

          {/* Title */}
          <Text className="text-3xl font-bold text-gray-900 text-center mb-4 leading-tight">
            {principle.title}
          </Text>

          {/* One Liner */}
          <Text className="text-xl text-gray-600 text-center mb-6 leading-relaxed">
            {principle.oneLiner}
          </Text>

          {/* Type and Category */}
          <View className="flex-row items-center justify-center gap-3">
            <View className="bg-brand-primary/10 px-3 py-1.5 rounded-full">
              <Text className="text-sm font-medium text-brand-primary">
                {getTypeLabel(principle.type)}
              </Text>
            </View>
            <CategoryChip 
              category={principle.category}
              size="md"
            />
          </View>
        </View>

        {/* Definition */}
        <View className="bg-white mx-6 rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            What is it?
          </Text>
          <Text className="text-lg text-gray-700 leading-relaxed">
            {principle.definition}
          </Text>
        </View>

        {/* Do's */}
        {principle.do.length > 0 && (
          <View className="bg-white mx-6 rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              ✅ What to do
            </Text>
            <View className="space-y-3">
              {principle.do.map((item, index) => (
                <View key={index} className="flex-row items-start">
                  <Text className="text-green-500 text-lg mr-3 mt-0.5">•</Text>
                  <Text className="flex-1 text-base text-gray-700 leading-relaxed">
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Don'ts */}
        {principle.dont.length > 0 && (
          <View className="bg-white mx-6 rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              ❌ What to avoid
            </Text>
            <View className="space-y-3">
              {principle.dont.map((item, index) => (
                <View key={index} className="flex-row items-start">
                  <Text className="text-red-500 text-lg mr-3 mt-0.5">•</Text>
                  <Text className="flex-1 text-base text-gray-700 leading-relaxed">
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* When to Apply */}
        {principle.appliesWhen.length > 0 && (
          <View className="bg-white mx-6 rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              🎯 When to apply
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {principle.appliesWhen.map((item, index) => (
                <View 
                  key={index}
                  className="bg-blue-50 px-3 py-2 rounded-lg"
                >
                  <Text className="text-sm text-blue-700 font-medium capitalize">
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Tags */}
        {principle.tags.length > 0 && (
          <View className="bg-white mx-6 rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              🏷️ Related topics
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {principle.tags.map((tag, index) => (
                <View 
                  key={index}
                  className="bg-gray-100 px-3 py-2 rounded-lg"
                >
                  <Text className="text-sm text-gray-600 font-medium">
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Sources */}
        {principle.sources.length > 0 && (
          <View className="bg-white mx-6 rounded-xl p-6 shadow-sm border border-gray-100">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              📚 Learn more
            </Text>
            <View className="space-y-3">
              {principle.sources.map((source, index) => (
                <TouchableOpacity 
                  key={index}
                  className="flex-row items-center p-3 bg-gray-50 rounded-lg"
                  activeOpacity={0.7}
                >
                  <Text className="text-blue-500 text-base mr-3">🔗</Text>
                  <Text 
                    className="flex-1 text-base text-blue-600 underline"
                    numberOfLines={1}
                  >
                    {source}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
      </SafeAreaView>
    </>
  );
}