import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button } from '@/src/components/ui/Button';
import { usePrinciples } from '@/src/store/usePrinciples';
import { useFavorites } from '@/src/store/useFavorites';

export default function QuizSetupScreen() {
  const router = useRouter();
  const { principles } = usePrinciples();
  const { getFavoriteIds } = useFavorites();
  const [selectedMode, setSelectedMode] = useState<'all' | 'favorites'>('all');
  const insets = useSafeAreaInsets();

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
            Take a Quiz
          </Text>

          <View className="w-16" />
        </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 32, paddingBottom: Math.max(insets.bottom, 32) }}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View className="mb-8">
              <Text className="text-2xl font-bold text-gray-900 mb-2">
                Take a Quiz
              </Text>
              <Text className="text-base text-gray-600">
                Test your knowledge with AI-generated multiple choice questions
              </Text>
            </View>

            {/* Quiz Mode Cards */}
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
                    Get quizzed on all {principleCount} UX principles. Great for comprehensive testing.
                  </Text>
                  <View className="bg-blue-100 px-3 py-1 rounded-full">
                    <Text className="text-sm font-medium text-blue-700">
                      {principleCount} principles
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
                      ? "Add some favorites first to unlock this quiz mode!"
                      : "Focus your quiz on your bookmarked principles."
                    }
                  </Text>
                  <View className={`px-3 py-1 rounded-full ${favoriteCount === 0 ? 'bg-gray-100' : 'bg-yellow-100'}`}>
                    <Text className={`text-sm font-medium ${favoriteCount === 0 ? 'text-gray-500' : 'text-yellow-700'}`}>
                      {favoriteCount === 0 ? 'None yet' : `${favoriteCount} principles`}
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
              onPress={handleStartQuiz}
              className="w-full"
              disabled={studyCount === 0}
            >
              Start Quiz {studyCount > 0 && `(${studyCount} principles)`}
            </Button>
            </View>
          </ScrollView>
        </View>
      </View>
    </>
  );
}