import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '@/src/components/ui/Button';
import { FlashCard } from '@/src/components/quiz/FlashCard';
import { usePrinciples } from '@/src/store/usePrinciples';
import { useFavorites } from '@/src/store/useFavorites';
import { Principle } from '@/src/data/types';

export default function FlashcardSessionScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode: 'all' | 'favorites' }>();
  const { principles } = usePrinciples();
  const { getFavoriteIds } = useFavorites();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionPrinciples, setSessionPrinciples] = useState<Principle[]>([]);

  useEffect(() => {
    // Filter principles based on mode
    let filtered = [...principles];
    
    if (mode === 'favorites') {
      const favoriteIds = getFavoriteIds();
      filtered = principles.filter(p => favoriteIds.includes(p.id));
    }
    
    // Shuffle the principles for varied study experience
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setSessionPrinciples(shuffled);
  }, [principles, mode, getFavoriteIds]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < sessionPrinciples.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleFinish = () => {
    router.back();
  };

  if (sessionPrinciples.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-xl font-bold text-gray-900 mb-2">
            No principles to study
          </Text>
          <Text className="text-base text-gray-600 text-center mb-6">
            {mode === 'favorites' 
              ? 'You don\'t have any favorites yet. Go favorite some principles first!'
              : 'No principles available to study.'}
          </Text>
          <Button variant="primary" size="lg" onPress={handleFinish}>
            Back to Practice
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const currentPrinciple = sessionPrinciples[currentIndex];
  const progress = ((currentIndex + 1) / sessionPrinciples.length) * 100;

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 py-4 border-b border-gray-100 bg-white">
          <View className="flex-row items-center justify-between mb-3">
            <Button
              variant="ghost"
              size="sm"
              onPress={handleFinish}
              className="w-auto"
            >
              ← Back
            </Button>
            <Text className="text-base font-medium text-gray-600">
              {currentIndex + 1} of {sessionPrinciples.length}
            </Text>
          </View>
          
          {/* Progress Bar */}
          <View className="bg-gray-200 rounded-full h-2">
            <View 
              className="bg-brand-primary rounded-full h-2"
              style={{ width: `${progress}%` }}
            />
          </View>
        </View>

        {/* Flashcard */}
        <View className="flex-1 px-6 py-6">
          <FlashCard 
            principle={currentPrinciple}
            className="flex-1"
          />
        </View>

        {/* Navigation */}
        <View className="px-6 py-4 bg-white border-t border-gray-100">
          <View className="flex-row gap-3">
            <Button
              variant="outline"
              size="lg"
              onPress={handlePrevious}
              disabled={currentIndex === 0}
              className="flex-1"
            >
              ← Previous
            </Button>
            
            {currentIndex === sessionPrinciples.length - 1 ? (
              <Button
                variant="primary"
                size="lg"
                onPress={handleFinish}
                className="flex-1"
              >
                Finish Study ✅
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onPress={handleNext}
                className="flex-1"
              >
                Next →
              </Button>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}