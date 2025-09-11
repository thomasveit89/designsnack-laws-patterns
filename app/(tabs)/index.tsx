import React, { useEffect } from 'react';
import { View, ScrollView, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DailyCard } from '@/src/components/home/DailyCard';
import { usePrinciples } from '@/src/store/usePrinciples';
import { useDaily } from '@/src/store/useDaily';
import { useFavorites } from '@/src/store/useFavorites';
import { formatDate } from '@/src/lib/utils';

export default function HomeScreen() {
  const { loadPrinciples, isLoading: principlesLoading } = usePrinciples();
  const { todaysPrinciple, loadTodaysPrinciple, isLoading: dailyLoading } = useDaily();
  const { loadFavorites } = useFavorites();

  useEffect(() => {
    // Load data when screen mounts
    loadPrinciples();
    loadFavorites();
  }, [loadPrinciples, loadFavorites]);

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
          <Text className="text-gray-600 text-center">
            Something went wrong loading today's principle. Please try again.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleLearnMore = () => {
    // TODO: Navigate to detail screen
    console.log('Navigate to principle detail:', todaysPrinciple.id);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Header */}
        <View className="pt-4 pb-6 px-6">
          <Text className="text-3xl font-bold text-brand-primary mb-1">
            DESIGNSNACK
          </Text>
          <Text className="text-lg text-gray-600 mb-2">
            Laws & Patterns
          </Text>
          <Text className="text-sm text-gray-500">
            {formatDate(today, 'long')}
          </Text>
        </View>

        {/* Daily Principle Card */}
        <DailyCard 
          principle={todaysPrinciple}
          onLearnMore={handleLearnMore}
          className="mb-6"
        />

        {/* Quick Stats */}
        <View className="mx-6 bg-white rounded-xl p-4 border border-gray-100">
          <Text className="text-base font-semibold text-gray-900 mb-2">
            Your Progress
          </Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-brand-primary">
                {useFavorites.getState().getFavoriteCount()}
              </Text>
              <Text className="text-sm text-gray-600">Favorites</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-500">20</Text>
              <Text className="text-sm text-gray-600">Principles</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-purple-500">4</Text>
              <Text className="text-sm text-gray-600">Categories</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
