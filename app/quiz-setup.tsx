import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Button } from '@/src/components/ui/Button';
import { usePrinciples } from '@/src/store/usePrinciples';
import { useFavorites } from '@/src/store/useFavorites';

export default function QuizSetupScreen() {
  const router = useRouter();
  const { principles } = usePrinciples();
  const { getFavoriteIds } = useFavorites();
  const [selectedMode, setSelectedMode] = useState<'all' | 'favorites'>('all');

  const handleBack = () => {
    router.back();
  };

  const handleStartQuiz = () => {
    router.push(`/quiz-session?mode=${selectedMode}`);
  };

  const favoriteIds = getFavoriteIds();
  const favoriteCount = favoriteIds.length;
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
            <Text className="text-2xl mr-2">←</Text>
            <Text className="text-lg font-medium text-gray-700">Back</Text>
          </TouchableOpacity>

          <Text className="text-lg font-semibold text-gray-900">
            Take a Quiz
          </Text>

          <View className="w-16" />
        </View>

        <View className="flex-1 px-6 py-6">

          {/* Study Mode Selection */}
          <View className="mb-8">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              What would you like to be quizzed on?
            </Text>

            <View className="space-y-4">
              {/* All Principles Option */}
              <Button
                variant={selectedMode === 'all' ? 'primary' : 'outline'}
                size="lg"
                onPress={() => setSelectedMode('all')}
                className="w-full mb-4"
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

          {/* Quiz Info */}
          <View className="bg-blue-50 rounded-xl p-4 mb-8">
            <Text className="text-base text-blue-800 text-center">
              🧠 You'll get 10 AI-generated multiple choice questions. Each question has 4 options with 1 correct answer.
            </Text>
          </View>

          {/* Start Button */}
          <View className="flex-1 justify-end">
            <Button
              variant="primary"
              size="lg"
              onPress={handleStartQuiz}
              className="w-full"
              disabled={studyCount === 0}
            >
              Start Quiz {studyCount > 0 && `(${studyCount} principles)`}
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}