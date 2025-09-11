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
        contentContainerStyle={{ paddingBottom: 32, paddingTop: 16 }}
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
