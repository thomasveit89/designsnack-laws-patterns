import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />
      <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
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
            Privacy Policy
          </Text>

          <View className="w-16" />
        </View>

        {/* WebView for Privacy Policy */}
        <WebView
          source={{ uri: 'https://designsnack.ch/privacy/laws-patterns-app' }}
          style={{ flex: 1 }}
          startInLoadingState={true}
          renderLoading={() => (
            <View className="flex-1 justify-center items-center bg-gray-50">
              <Text className="text-lg text-gray-600">Loading Privacy Policy...</Text>
            </View>
          )}
          renderError={() => (
            <View className="flex-1 justify-center items-center bg-gray-50 px-6">
              <Text className="text-6xl mb-4">⚠️</Text>
              <Text className="text-xl font-bold text-gray-900 mb-2">
                Unable to Load
              </Text>
              <Text className="text-base text-gray-600 text-center mb-6">
                Please check your internet connection and try again.
              </Text>
              <TouchableOpacity
                onPress={() => router.back()}
                className="bg-blue-500 px-6 py-3 rounded-lg"
              >
                <Text className="text-white font-semibold">Go Back</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </>
  );
}