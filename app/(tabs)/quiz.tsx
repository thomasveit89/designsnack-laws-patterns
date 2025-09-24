import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/src/components/ui/Button';

export default function PracticeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleFlashcards = () => {
    router.push('/flashcards');
  };

  const handleQuiz = () => {
    router.push('/quiz-setup');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 24, paddingBottom: Math.max(insets.bottom, 32) }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Practice
          </Text>
          <Text className="text-base text-gray-600">
            Choose how you'd like to study UX principles
          </Text>
        </View>

        {/* Practice Modes */}
        <View className="flex-1 justify-center space-y-6">
          {/* Flashcards Mode */}
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
            <View className="items-center mb-4">
              <Text className="text-4xl mb-2">🎴</Text>
              <Text className="text-xl font-bold text-gray-900 mb-2">
                Study with Flashcards
              </Text>
              <Text className="text-base text-gray-600 text-center">
                Review principles at your own pace. See the title, flip to reveal the definition and key points.
              </Text>
            </View>
            <Button
              variant="primary"
              size="lg"
              onPress={handleFlashcards}
              className="w-full"
            >
              Start Studying
            </Button>
          </View>

          {/* Quiz Mode */}
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <View className="items-center mb-4">
              <Text className="text-4xl mb-2">🧠</Text>
              <Text className="text-xl font-bold text-gray-900 mb-2">
                Take a Quiz
              </Text>
              <Text className="text-base text-gray-600 text-center">
                Test your knowledge with AI-generated questions. Choose from Quick (10), Standard (25), Complete (50), or Marathon (all 103) quiz lengths.
              </Text>
            </View>
            <Button
              variant="primary"
              size="lg"
              onPress={handleQuiz}
              className="w-full"
            >
              Start Quiz
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}