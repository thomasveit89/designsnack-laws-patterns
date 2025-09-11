import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-3xl font-bold text-brand-primary mb-2">
        DESIGNSNACK
      </Text>
      <Text className="text-lg text-gray-600 mb-8">
        Laws & Patterns
      </Text>
      
      <View className="bg-gray-100 rounded-2xl p-6 w-full max-w-sm">
        <Text className="text-xl font-semibold text-gray-900 mb-2">
          Today's Law
        </Text>
        <Text className="text-base text-gray-600">
          Your daily UX principle will appear here once we add content...
        </Text>
      </View>
    </View>
  );
}
