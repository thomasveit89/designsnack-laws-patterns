import React from 'react';
import { Text, View, ScrollView, TouchableOpacity, Linking, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import * as StoreReview from 'expo-store-review';
import { DesignsnackLogo } from '@/src/components/ui/DesignsnackLogo';

export default function AboutScreen() {
  const router = useRouter();

  const openURL = async (url: string) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this link');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open link');
      console.error('Error opening URL:', error);
    }
  };

  const openPrivacyPolicy = () => {
    router.push('/legal/privacy-policy');
  };

  const openTermsOfService = () => {
    router.push('/legal/terms-of-service');
  };

  const handleRateApp = async () => {
    try {
      // Check if the device supports in-app reviews
      const isAvailable = await StoreReview.isAvailableAsync();

      if (isAvailable) {
        // Request the native in-app review dialog
        await StoreReview.requestReview();
      } else {
        // Fallback for development/testing: open store page directly
        const storeUrl = Platform.select({
          ios: Constants.expoConfig?.ios?.appStoreUrl ||
               'https://apps.apple.com/app/id6754067995',
          android: `https://play.google.com/store/apps/details?id=${Constants.expoConfig?.android?.package || 'com.designsnack.lawspatterns'}`,
          default: 'https://designsnack.ch'
        });

        await openURL(storeUrl);
      }
    } catch (error) {
      console.error('Error opening store review:', error);
      Alert.alert(
        'Rate Our App',
        Platform.OS === 'ios'
          ? 'Please rate us on the App Store to support our work!'
          : 'Please rate us on the Play Store to support our work!',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 24, paddingBottom: 10 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-8">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            About
          </Text>
          <Text className="text-base text-gray-600">
            For the love of design & UX ❤️
          </Text>
        </View>

        {/* App Info */}
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <View className="items-center">
            <View className="mb-4">
              <DesignsnackLogo width={168} height={20} />
            </View>
            <Text className="text-xl font-bold text-gray-900 mb-2">
              Laws & Patterns
            </Text>
            <Text className="text-base text-gray-600 text-center">
              Master 100+ essential UX design principles through interactive learning
            </Text>
          </View>
        </View>

        {/* Features */}
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            What's Inside
          </Text>
          <View className="space-y-3">
            <View className="flex-row items-start mb-2">
              <Text className="text-blue-500 text-base mr-3 mt-1">📖</Text>
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-900">100+ UX Principles</Text>
                <Text className="text-base text-gray-600">Laws, cognitive biases, and design heuristics</Text>
              </View>
            </View>
            <View className="flex-row items-start mb-2">
              <Text className="text-blue-500 text-base mr-3 mt-1">🎴</Text>
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-900">Interactive Flashcards</Text>
                <Text className="text-base text-gray-600">Study at your own pace</Text>
              </View>
            </View>
            <View className="flex-row items-start mb-2">
              <Text className="text-blue-500 text-base mr-3 mt-1">🧠</Text>
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-900">AI-Powered Quizzes</Text>
                <Text className="text-base text-gray-600">Test knowledge with flexible quiz lengths</Text>
              </View>
            </View>
            <View className="flex-row items-start">
              <Text className="text-blue-500 text-base mr-3 mt-1">⭐</Text>
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-900">Favorites System</Text>
                <Text className="text-base text-gray-600">Bookmark principles for focused study</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Legal Section */}
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Legal & Privacy
          </Text>
          <View className="space-y-3">
            <TouchableOpacity
              onPress={openPrivacyPolicy}
              className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg mb-2"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <Text className="text-gray-600 text-base mr-3">🔒</Text>
                <Text className="text-base font-medium text-gray-900">Privacy Policy</Text>
              </View>
              <Text className="text-gray-400 text-lg">›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={openTermsOfService}
              className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <Text className="text-gray-600 text-base mr-3">📄</Text>
                <Text className="text-base font-medium text-gray-900">Terms of Service</Text>
              </View>
              <Text className="text-gray-400 text-lg">›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Support Section */}
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Support & Feedback
          </Text>
          <View className="space-y-3">
            <TouchableOpacity
              onPress={() => openURL('mailto:hi@designsnack.ch?subject=DESIGNSNACK Laws and Patterns App')}
              className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg mb-2"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <Text className="text-gray-600 text-base mr-3">✉️</Text>
                <Text className="text-base font-medium text-gray-900">Contact Us</Text>
              </View>
              <Text className="text-gray-400 text-lg">›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleRateApp}
              className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <Text className="text-gray-600 text-base mr-3">⭐</Text>
                <Text className="text-base font-medium text-gray-900">Rate the App</Text>
              </View>
              <Text className="text-gray-400 text-lg">›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View className="mt-8 mb-4 pt-6 border-t border-gray-200">
          <Text className="text-center text-sm text-gray-500">
            Made by DESIGNSNACK
          </Text>
          <Text className="text-center text-xs text-gray-400 mt-2">
            © 2025 DESIGNSNACK GmbH – Powered by coffee & curiosity
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}