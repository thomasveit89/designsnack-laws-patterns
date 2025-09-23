import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button } from '@/src/components/ui/Button';
import { usePrinciples } from '@/src/store/usePrinciples';
import { useFavorites } from '@/src/store/useFavorites';

export default function FlashcardsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { principles, loadPrinciples } = usePrinciples();
  const { loadFavorites, getFavoriteIds, getFavoriteCount } = useFavorites();
  const [selectedMode, setSelectedMode] = useState<'all' | 'favorites'>('all');

  useEffect(() => {
    loadPrinciples();
    loadFavorites();
  }, [loadPrinciples, loadFavorites]);

  const handleStartStudy = () => {
    router.push(`/flashcard-session?mode=${selectedMode}`);
  };

  const handleBack = () => {
    router.back();
  };

  const favoriteCount = getFavoriteCount();
  const principleCount = principles.length;
  const studyCount = selectedMode === 'all' ? principleCount : favoriteCount;

  console.log('🔍 Flashcards state:', { selectedMode, favoriteCount, principleCount });


  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />
      <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
        <View className="flex-1 bg-gray-50">
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
          <TouchableOpacity
            onPress={handleBack}
            className="flex-row items-center"
          >
            <Text className="text-2xl mr-2">←</Text>
            <Text className="text-lg font-medium text-gray-700">Back</Text>
          </TouchableOpacity>

          <Text className="text-lg font-semibold text-gray-900">
            Flashcards
          </Text>

          <View className="w-12" />
        </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 32, paddingBottom: Math.max(insets.bottom, 32) }}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View className="mb-8">
              <Text className="text-2xl font-bold text-gray-900 mb-2">
                Study with Flashcards
              </Text>
              <Text className="text-base text-gray-600">
                Choose your study mode and review principles at your own pace
              </Text>
            </View>

            {/* Study Mode Cards */}
            <View className="justify-center">
              {/* All Principles Card */}
              <TouchableOpacity
                onPress={() => setSelectedMode('all')}
                activeOpacity={0.8}
              >
                <View className={`rounded-2xl p-6 shadow-sm border mb-4 ${
                  selectedMode === 'all' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-white'
                }`}>
                <View className="items-center mb-4">
                  <Text className="text-4xl mb-2">📚</Text>
                  <Text className="text-xl font-bold text-gray-900 mb-2">
                    All Principles
                  </Text>
                  <Text className="text-base text-gray-600 text-center mb-2">
                    Study all {principleCount} UX principles in your collection. Perfect for comprehensive review.
                  </Text>
                  <View className="bg-blue-100 px-3 py-1 rounded-full">
                    <Text className="text-sm font-medium text-blue-700">
                      {principleCount} cards
                    </Text>
                  </View>
                </View>
                </View>
              </TouchableOpacity>

              {/* Favorites Card */}
              <TouchableOpacity
                onPress={() => favoriteCount > 0 && setSelectedMode('favorites')}
                activeOpacity={0.8}
                disabled={favoriteCount === 0}
              >
                <View className={`rounded-2xl p-6 shadow-sm border ${
                  favoriteCount === 0
                    ? 'border-gray-100 bg-white opacity-50'
                    : selectedMode === 'favorites'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-100 bg-white'
                }`}>
                <View className="items-center mb-4">
                  <Text className="text-4xl mb-2">⭐</Text>
                  <Text className="text-xl font-bold text-gray-900 mb-2">
                    Your Favorites
                  </Text>
                  <Text className="text-base text-gray-600 text-center mb-2">
                    {favoriteCount === 0
                      ? "Add some favorites first to unlock this study mode!"
                      : "Focus on your bookmarked principles for targeted learning."
                    }
                  </Text>
                  <View className={`px-3 py-1 rounded-full ${favoriteCount === 0 ? 'bg-gray-100' : 'bg-yellow-100'}`}>
                    <Text className={`text-sm font-medium ${favoriteCount === 0 ? 'text-gray-500' : 'text-yellow-700'}`}>
                      {favoriteCount === 0 ? 'None yet' : `${favoriteCount} cards`}
                    </Text>
                  </View>
                </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Start Button */}
            <View className="mt-6">
            <Button
              variant="primary"
              size="lg"
              onPress={handleStartStudy}
              className="w-full"
              disabled={studyCount === 0}
            >
              Start Studying {studyCount > 0 && `(${studyCount} cards)`}
            </Button>
            </View>
          </ScrollView>
        </View>
      </View>
    </>
  );
}