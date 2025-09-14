import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Button } from '@/src/components/ui/Button';

export default function QuizResultsScreen() {
  const router = useRouter();
  const { score, total, percentage } = useLocalSearchParams<{
    score: string;
    total: string;
    percentage: string;
  }>();

  const scoreNum = parseInt(score || '0');
  const totalNum = parseInt(total || '10');
  const percentageNum = parseInt(percentage || '0');

  const handleReturnToPractice = () => {
    router.dismissAll();
    router.replace('/(tabs)/quiz');
  };

  const handleRetakeQuiz = () => {
    router.back();
    router.back(); // Go back to quiz setup
  };

  const getScoreEmoji = () => {
    if (percentageNum >= 90) return '🏆';
    if (percentageNum >= 80) return '🎉';
    if (percentageNum >= 70) return '👍';
    if (percentageNum >= 60) return '👌';
    return '💪';
  };

  const getScoreMessage = () => {
    if (percentageNum >= 90) return 'Outstanding! You\'re a UX expert!';
    if (percentageNum >= 80) return 'Great job! You know your UX principles well!';
    if (percentageNum >= 70) return 'Good work! You\'re on the right track!';
    if (percentageNum >= 60) return 'Not bad! Keep studying to improve!';
    return 'Keep practicing! Review the principles and try again!';
  };

  const getScoreColor = () => {
    if (percentageNum >= 80) return 'text-green-600';
    if (percentageNum >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
          <TouchableOpacity
            onPress={handleReturnToPractice}
            className="flex-row items-center"
          >
            <Text className="text-2xl mr-2">←</Text>
            <Text className="text-lg font-medium text-gray-700">Done</Text>
          </TouchableOpacity>

          <Text className="text-lg font-semibold text-gray-900">
            Quiz Results
          </Text>

          <View className="w-16" />
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-6 py-8">

            {/* Score Display */}
            <View className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
              <View className="items-center">
                <Text className="text-6xl mb-4" style={{ lineHeight: 120, includeFontPadding: false }}>{getScoreEmoji()}</Text>

                <Text className="text-4xl font-bold text-gray-900 mb-2">
                  {scoreNum}/{totalNum}
                </Text>

                <Text className={`text-2xl font-semibold mb-4 ${getScoreColor()}`}>
                  {percentageNum}%
                </Text>

                <Text className="text-lg text-center text-gray-700 font-medium">
                  {getScoreMessage()}
                </Text>
              </View>
            </View>

            {/* Score Breakdown */}
            <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-4">
                Performance Summary
              </Text>

              <View className="space-y-3">
                <View className="flex-row items-center justify-between py-2">
                  <Text className="text-base text-gray-700">Correct Answers</Text>
                  <Text className="text-base font-semibold text-green-600">
                    {scoreNum} questions
                  </Text>
                </View>

                <View className="flex-row items-center justify-between py-2">
                  <Text className="text-base text-gray-700">Incorrect Answers</Text>
                  <Text className="text-base font-semibold text-red-600">
                    {totalNum - scoreNum} questions
                  </Text>
                </View>

                <View className="flex-row items-center justify-between py-2 border-t border-gray-100 pt-3">
                  <Text className="text-base font-semibold text-gray-900">Final Score</Text>
                  <Text className={`text-base font-bold ${getScoreColor()}`}>
                    {percentageNum}%
                  </Text>
                </View>
              </View>
            </View>

            {/* Motivational Section */}
            <View className="bg-blue-50 rounded-2xl p-6 mb-8">
              <Text className="text-base text-blue-800 text-center leading-relaxed">
                {percentageNum >= 80
                  ? "🌟 Excellent work! You have a strong understanding of UX principles. Keep applying these concepts in your design work!"
                  : "📚 Great effort! Review the principles you missed and try studying with flashcards to reinforce your knowledge."
                }
              </Text>
            </View>

            {/* Action Buttons */}
            <View className="space-y-3">
              <Button
                variant="outline"
                size="lg"
                onPress={handleRetakeQuiz}
                className="w-full mb-4"
              >
                🔄 Take Another Quiz
              </Button>

              <Button
                variant="outline"
                size="lg"
                onPress={() => router.push('/flashcards')}
                className="w-full"
              >
                📚 Study with Flashcards
              </Button>

              <Button
                variant="ghost"
                size="lg"
                onPress={handleReturnToPractice}
                className="w-full"
              >
                Return to Practice
              </Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}