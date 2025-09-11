import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function QuizScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold text-gray-900">
          Practice Quiz
        </Text>
        <Text className="text-base text-gray-600 mt-4 text-center px-6">
          Flashcard practice mode coming soon...
        </Text>
      </View>
    </SafeAreaView>
  );
}