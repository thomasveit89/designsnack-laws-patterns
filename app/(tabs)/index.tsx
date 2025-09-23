import React, { useEffect } from 'react';
import { View, ScrollView, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { DailyCard } from '@/src/components/home/DailyCard';
import { usePrinciples } from '@/src/store/usePrinciples';
import { useDaily } from '@/src/store/useDaily';
import { useFavorites } from '@/src/store/useFavorites';
import { formatDate } from '@/src/lib/utils';

export default function HomeScreen() {
  const { loadPrinciples, principles, isLoading: principlesLoading, error, isOffline } = usePrinciples();
  const { todaysPrinciple, loadTodaysPrinciple, isLoading: dailyLoading } = useDaily();
  const { loadFavorites, clearFavorites, getFavoriteCount } = useFavorites();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Load data when screen mounts
    console.log('🏠 HomeScreen mounted, loading principles...');
    loadPrinciples();
    loadFavorites();
  }, [loadPrinciples, loadFavorites]);

  // Debug logging
  useEffect(() => {
    console.log('🏠 HomeScreen - Principles state:', {
      count: principles.length,
      isLoading: principlesLoading,
      error,
      isOffline,
      todaysPrinciple: todaysPrinciple?.title || 'none'
    });
  }, [principles.length, principlesLoading, error, isOffline, todaysPrinciple]);

  useEffect(() => {
    // Load today's principle after principles are loaded
    if (!principlesLoading) {
      loadTodaysPrinciple();
    }
  }, [principlesLoading, loadTodaysPrinciple]);

  const isLoading = principlesLoading || dailyLoading;
  const today = new Date();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0EA5E9" />
          <Text className="text-gray-600 mt-4">Loading today's principle...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!todaysPrinciple) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-xl font-bold text-gray-900 mb-2">
            No principles available
          </Text>
          <Text className="text-gray-600 text-center mb-4">
            Something went wrong loading today's principle. Please try again.
          </Text>
          {error && (
            <View className="bg-red-100 p-4 rounded-lg mb-4">
              <Text className="text-red-800 font-semibold">Error:</Text>
              <Text className="text-red-700">{error}</Text>
            </View>
          )}
          <View className="bg-blue-100 p-4 rounded-lg mb-4">
            <Text className="text-blue-800 font-semibold">Debug Info:</Text>
            <Text className="text-blue-700">Principles loaded: {principles.length}</Text>
            <Text className="text-blue-700">Is offline: {isOffline ? 'Yes' : 'No'}</Text>
            <Text className="text-blue-700">Is loading: {principlesLoading ? 'Yes' : 'No'}</Text>
            <Text className="text-blue-700">Favorites: {getFavoriteCount()}</Text>
          </View>
          <TouchableOpacity 
            onPress={clearFavorites}
            className="bg-red-100 p-3 rounded-lg"
          >
            <Text className="text-red-800 font-semibold text-center">Clear Favorites Cache</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleLearnMore = () => {
    if (todaysPrinciple) {
      router.push(`/principle/${todaysPrinciple.id}`);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80, paddingTop: 16 }}
      >
        {/* Daily Principle Card */}
        <DailyCard
          principle={todaysPrinciple}
          onLearnMore={handleLearnMore}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
