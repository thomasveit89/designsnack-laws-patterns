import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/src/components/ui/Button';

export default function PracticeScreen() {
  const router = useRouter();

  const handleFlashcards = () => {
    router.push('/flashcards');
  };

  const handleQuiz = () => {
    // Placeholder for now
    alert('Quiz mode coming soon! 🚀');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 px-6 py-8">
        {/* Header */}
        <View className="mb-8">
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
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
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
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 opacity-60">
            <View className="items-center mb-4">
              <Text className="text-4xl mb-2">🧠</Text>
              <Text className="text-xl font-bold text-gray-900 mb-2">
                Take a Quiz
              </Text>
              <Text className="text-base text-gray-600 text-center">
                Test your knowledge with questions and scenarios. Coming soon!
              </Text>
            </View>
            <Button 
              variant="ghost" 
              size="lg" 
              onPress={handleQuiz}
              className="w-full"
              disabled
            >
              Coming Soon
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}