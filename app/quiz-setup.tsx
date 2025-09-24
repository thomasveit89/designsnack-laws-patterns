import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button } from '@/src/components/ui/Button';
import { usePrinciples } from '@/src/store/usePrinciples';
import { useFavorites } from '@/src/store/useFavorites';
import { QuizLength } from '@/src/data/types';
import { QUIZ_LENGTHS } from '@/src/lib/quiz-config';

export default function QuizSetupScreen() {
  const router = useRouter();
  const { principles } = usePrinciples();
  const { getFavoriteIds } = useFavorites();
  const [selectedMode, setSelectedMode] = useState<'all' | 'favorites'>('all');
  const [selectedLength, setSelectedLength] = useState<QuizLength>('standard');
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    router.back();
  };

  const handleStartQuiz = () => {
    router.push(`/quiz-session?mode=${selectedMode}&length=${selectedLength}`);
  };

  const favoriteIds = getFavoriteIds();
  const favoriteCount = favoriteIds.length;
  const principleCount = principles.length;

  const availableCount = selectedMode === 'all' ? principleCount : favoriteCount;
  const requestedCount = QUIZ_LENGTHS[selectedLength].questions;
  const actualQuestionCount = selectedLength === 'marathon' ? availableCount : Math.min(requestedCount, availableCount);


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
            <View className="mb-8">
              <Text className="text-lg font-semibold text-gray-900 mb-4">
                Choose Your Principles
              </Text>
              <View className="flex-row gap-4">
                {/* All Principles Card */}
                <TouchableOpacity
                  onPress={() => setSelectedMode('all')}
                  activeOpacity={0.8}
                  className="flex-1"
                >
                  <View className={`rounded-2xl p-4 shadow-sm border ${selectedMode === 'all' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-white'
                    }`}>
                    <View className="items-center">
                      <Text className="text-3xl mb-2">📚</Text>
                      <Text className="text-lg font-bold text-gray-900 mb-1">
                        All Principles
                      </Text>
                      <View className="bg-blue-100 px-2 py-1 rounded-full">
                        <Text className="text-xs font-medium text-blue-700">
                          {principleCount} available
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
                  className="flex-1"
                >
                  <View className={`rounded-2xl p-4 shadow-sm border ${favoriteCount === 0
                    ? 'border-gray-100 bg-white opacity-50'
                    : selectedMode === 'favorites'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-100 bg-white'
                    }`}>
                    <View className="items-center">
                      <Text className="text-3xl mb-2">⭐</Text>
                      <Text className="text-lg font-bold text-gray-900 mb-1">
                        Favorites
                      </Text>
                      <View className={`px-2 py-1 rounded-full ${favoriteCount === 0 ? 'bg-gray-100' : 'bg-yellow-100'}`}>
                        <Text className={`text-xs font-medium ${favoriteCount === 0 ? 'text-gray-500' : 'text-yellow-700'}`}>
                          {favoriteCount === 0 ? 'None yet' : `${favoriteCount} available`}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Quiz Length Cards */}
            <View>
              <Text className="text-lg font-semibold text-gray-900 mb-4">
                Choose Quiz Length
              </Text>
              <View className="space-y-3">
                {Object.entries(QUIZ_LENGTHS).map(([key, config]) => {
                  const length = key as QuizLength;
                  const isDisabled = config.questions > availableCount && length !== 'marathon';
                  const questionCount = length === 'marathon' ? availableCount : Math.min(config.questions, availableCount);

                  return (
                    <TouchableOpacity
                      key={length}
                      onPress={() => !isDisabled && setSelectedLength(length)}
                      activeOpacity={0.8}
                      disabled={isDisabled}
                    >
                      <View className={`rounded-2xl p-4 mb-2 shadow-sm border ${isDisabled
                        ? 'border-gray-100 bg-white opacity-50'
                        : selectedLength === length
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-100 bg-white'
                        }`}>
                        <View className="flex-row items-center">
                          <Text className="text-2xl mr-3">{config.emoji}</Text>
                          <View className="flex-1">
                            <Text className="text-lg font-bold text-gray-900">
                              {config.label}
                            </Text>
                            <Text className="text-sm text-gray-600">
                              {config.description}
                            </Text>
                          </View>
                          <View className={`px-3 py-1 rounded-full ${isDisabled
                            ? 'bg-gray-100'
                            : selectedLength === length
                              ? 'bg-blue-100'
                              : 'bg-gray-100'
                            }`}>
                            <Text className={`text-sm font-medium ${isDisabled
                              ? 'text-gray-500'
                              : selectedLength === length
                                ? 'text-blue-700'
                                : 'text-gray-700'
                              }`}>
                              {questionCount} questions
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Start Button */}
            <View className="mt-3">
              <Button
                variant="primary"
                size="lg"
                onPress={handleStartQuiz}
                className="w-full"
                disabled={availableCount === 0}
              >
                Start Quiz ({actualQuestionCount} questions)
              </Button>
            </View>
          </ScrollView>
        </View>
      </View>
    </>
  );
}