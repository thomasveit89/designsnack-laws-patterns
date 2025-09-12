import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Button } from '@/src/components/ui/Button';
import { usePrinciples } from '@/src/store/usePrinciples';
import { useFavorites } from '@/src/store/useFavorites';

export default function FlashcardsScreen() {
  const router = useRouter();
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

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
          <TouchableOpacity 
            onPress={handleBack}
            className="flex-row items-center"
          >
            <Text className="text-brand-primary text-base font-medium">
              ← Back
            </Text>
          </TouchableOpacity>
          
          <Text className="text-lg font-semibold text-gray-900">
            Flashcards
          </Text>
          
          <View className="w-12" />
        </View>

        <View className="flex-1 px-6 py-6">

        {/* Study Mode Selection */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            What would you like to study?
          </Text>
          
          <View className="space-y-4">
            {/* All Principles Option */}
            <Button
              variant={selectedMode === 'all' ? 'primary' : 'outline'}
              size="lg"
              onPress={() => setSelectedMode('all')}
              className="w-full"
            >
              📚 All Principles ({principleCount})
            </Button>

            {/* Favorites Option */}
            <Button
              variant={selectedMode === 'favorites' ? 'primary' : 'outline'}
              size="lg"
              onPress={() => setSelectedMode('favorites')}
              className="w-full"
              disabled={favoriteCount === 0}
            >
              ⭐ Favorites {favoriteCount === 0 ? '(None yet)' : `(${favoriteCount})`}
            </Button>
          </View>
        </View>

        {/* Study Info */}
        <View className="bg-blue-50 rounded-xl p-4 mb-8">
          <Text className="text-base text-blue-800 text-center">
            💡 Tap cards to flip them and see definitions. Study at your own pace!
          </Text>
        </View>

        {/* Start Button */}
        <View className="flex-1 justify-end">
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
      </SafeAreaView>
    </>
  );
}