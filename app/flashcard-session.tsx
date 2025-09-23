import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button } from '@/src/components/ui/Button';
import { FlashCard } from '@/src/components/quiz/FlashCard';
import { usePrinciples } from '@/src/store/usePrinciples';
import { useFavorites } from '@/src/store/useFavorites';
import { Principle } from '@/src/data/types';

export default function FlashcardSessionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { mode } = useLocalSearchParams<{ mode: 'all' | 'favorites' }>();
  const { principles } = usePrinciples();
  const { getFavoriteIds } = useFavorites();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionPrinciples, setSessionPrinciples] = useState<Principle[]>([]);
  const [cardResetTrigger, setCardResetTrigger] = useState(0);

  useEffect(() => {
    // Filter principles based on mode
    let filtered = [...principles];

    if (mode === 'favorites') {
      const favoriteIds = getFavoriteIds();
      filtered = principles.filter(p => favoriteIds.includes(p.id));
    }

    // Shuffle the principles for varied study experience
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setSessionPrinciples(shuffled);
  }, [principles, mode, getFavoriteIds]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCardResetTrigger(prev => prev + 1); // Trigger card reset
    }
  };

  const handleNext = () => {
    if (currentIndex < sessionPrinciples.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCardResetTrigger(prev => prev + 1); // Trigger card reset
    }
  };

  const handleFinish = () => {
    router.back();
  };

  if (sessionPrinciples.length === 0) {
    return (
      <>
        <StatusBar style="dark" />
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
          <View className="flex-1 bg-gray-50 justify-center items-center px-6">
          <Text className="text-xl font-bold text-gray-900 mb-2">
            No principles to study
          </Text>
          <Text className="text-base text-gray-600 text-center mb-6">
            {mode === 'favorites'
              ? 'You don\'t have any favorites yet. Go favorite some principles first!'
              : 'No principles available to study.'}
          </Text>
          <Button variant="primary" size="lg" onPress={handleFinish}>
            Back to Practice
          </Button>
          </View>
        </View>
      </>
    );
  }

  const currentPrinciple = sessionPrinciples[currentIndex];
  const progress = ((currentIndex + 1) / sessionPrinciples.length) * 100;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />
      <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
        <View className="flex-1 bg-gray-50">
          {/* Custom Header */}
          <View className="bg-white border-b border-gray-100">

          {/* Header Controls */}
          <View className="px-6 py-4">
            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                onPress={handleFinish}
                className="flex-row items-center"
              >
                <Text className="text-2xl mr-2">←</Text>
                <Text className="text-lg font-medium text-gray-700">Back</Text>
              </TouchableOpacity>
              <Text className="text-lg font-bold text-gray-900">
                Study Session
              </Text>
              <View className="w-16" />
            </View>
          </View>
        </View>

        {/* Progress Section */}
        <View className="bg-white px-6 py-4 border-b border-gray-100">
          <Text className="text-center text-base font-medium text-gray-600 mb-3">
            {currentIndex + 1} of {sessionPrinciples.length}
          </Text>
          <View className="bg-gray-200 rounded-full h-2">
            <View
              className="bg-brand-primary rounded-full h-2"
              style={{ width: `${progress}%` }}
            />
          </View>
        </View>

        <View className="flex-1">

          {/* Flashcard */}
          <View className="flex-1 px-6 py-6">
            <FlashCard
              principle={currentPrinciple}
              className="flex-1"
              resetTrigger={cardResetTrigger}
            />
          </View>

          {/* Navigation */}
          <View className="px-6 py-4 bg-white border-t border-gray-100" style={{ paddingBottom: 34 }}>
            <View className="flex-row gap-3">
              <Button
                variant="outline"
                size="lg"
                onPress={handlePrevious}
                disabled={currentIndex === 0}
                className="flex-1"
              >
                ← Previous
              </Button>

              {currentIndex === sessionPrinciples.length - 1 ? (
                <Button
                  variant="primary"
                  size="lg"
                  onPress={handleFinish}
                  className="flex-1"
                >
                  Finish Study ✅
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  onPress={handleNext}
                  className="flex-1"
                >
                  Next →
                </Button>
              )}
            </View>
          </View>
        </View>
        </View>
      </View>
    </>
  );
}