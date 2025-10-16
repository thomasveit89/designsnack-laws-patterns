import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button } from '@/src/components/ui/Button';
import { QuizQuestion } from '@/src/components/quiz/QuizQuestion';
import { useQuiz } from '@/src/store/useQuiz';
import { usePrinciples } from '@/src/store/usePrinciples';
import { useFavorites } from '@/src/store/useFavorites';
import { usePurchase, isPrincipleLocked } from '@/src/store/usePurchase';
import { QuizLength } from '@/src/data/types';

export default function QuizSessionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { mode, length } = useLocalSearchParams<{ mode: 'all' | 'favorites'; length: string }>();
  const { principles } = usePrinciples();
  const { getFavoriteIds } = useFavorites();
  const { isPremium } = usePurchase();
  const {
    currentSession,
    isLoading,
    error,
    startNewQuiz,
    answerQuestion,
    goToQuestion,
    submitQuiz,
    resetQuiz,
    clearError
  } = useQuiz();

  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) {
      initializeQuiz();
      setHasStarted(true);
    }
  }, [hasStarted]);

  const initializeQuiz = async () => {
    // Filter out locked principles first (alphabetically sorted)
    const sortedPrinciples = [...principles].sort((a, b) => a.title.localeCompare(b.title));
    let filtered = sortedPrinciples.filter((_, index) => !isPrincipleLocked(index, isPremium));

    // Then filter by mode
    if (mode === 'favorites') {
      const favoriteIds = getFavoriteIds();
      filtered = filtered.filter(p => favoriteIds.includes(p.id));
    }

    if (filtered.length === 0) {
      Alert.alert(
        'No Principles Available',
        mode === 'favorites'
          ? 'You don\'t have any favorites yet. Please add some favorites first.'
          : 'No principles available for quiz.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
      return;
    }

    await startNewQuiz(filtered, mode || 'all', length as QuizLength || 'standard');
  };

  const handleBack = () => {
    Alert.alert(
      'Exit Quiz',
      'Are you sure you want to exit? Your progress will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Exit', 
          style: 'destructive',
          onPress: () => {
            resetQuiz();
            router.back();
          }
        }
      ]
    );
  };

  const handlePrevious = () => {
    if (currentSession && currentSession.currentQuestionIndex > 0) {
      goToQuestion(currentSession.currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (!currentSession) return;

    const nextIndex = currentSession.currentQuestionIndex + 1;
    
    if (nextIndex < currentSession.questions.length) {
      goToQuestion(nextIndex);
    } else {
      // Last question - show submit confirmation
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!currentSession) return;

    const unansweredCount = currentSession.questions.length - currentSession.answers.length;
    
    if (unansweredCount > 0) {
      Alert.alert(
        'Incomplete Quiz',
        `You have ${unansweredCount} unanswered questions. Submit anyway?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Submit', onPress: completeQuiz }
        ]
      );
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    const result = submitQuiz();
    if (result) {
      router.replace({
        pathname: '/quiz-results',
        params: { 
          score: result.correctAnswers.toString(),
          total: result.totalQuestions.toString(),
          percentage: result.scorePercentage.toString()
        }
      });
    }
  };

  const handleAnswerSelect = (optionIndex: number) => {
    if (!currentSession) return;
    
    const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
    answerQuestion(currentQuestion.id, optionIndex);
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar style="dark" />
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
          <View className="flex-1 bg-gray-50 justify-center items-center px-6">
          <ActivityIndicator size="large" color="#0EA5E9" className="mb-4" />
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            Generating Quiz Questions...
          </Text>
          <Text className="text-base text-gray-600 text-center">
            Our AI is creating personalized questions for you
          </Text>
          </View>
        </View>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar style="dark" />
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
          <View className="flex-1 bg-gray-50 justify-center items-center px-6">
          <Text className="text-6xl mb-4">⚠️</Text>
          <Text className="text-xl font-bold text-gray-900 mb-2">
            Quiz Generation Failed
          </Text>
          <Text className="text-base text-gray-600 text-center mb-6">
            {error}
          </Text>
          <View className="flex-row gap-3">
            <Button
              variant="outline"
              size="lg"
              onPress={() => {
                clearError();
                router.back();
              }}
            >
              Go Back
            </Button>
            <Button
              variant="primary"
              size="lg"
              onPress={() => {
                clearError();
                initializeQuiz();
              }}
            >
              Try Again
            </Button>
          </View>
          </View>
        </View>
      </>
    );
  }

  // No session state
  if (!currentSession) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar style="dark" />
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
          <View className="flex-1 bg-gray-50 justify-center items-center px-6">
          <Text className="text-xl font-bold text-gray-900 mb-2">
            No Quiz Session
          </Text>
          <Button
            variant="primary"
            size="lg"
            onPress={() => router.back()}
          >
            Go Back
          </Button>
          </View>
        </View>
      </>
    );
  }

  const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
  const currentAnswer = currentSession.answers.find(a => a.questionId === currentQuestion.id);
  const hasAnsweredCurrent = currentAnswer !== undefined;
  const progress = ((currentSession.currentQuestionIndex + 1) / currentSession.questions.length) * 100;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />
      <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
        <View className="flex-1 bg-gray-50">
          {/* Custom Header */}
          <View className="bg-white border-b border-gray-100">

          {/* Header Controls */}
          <View className="px-6 py-4">
            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                onPress={handleBack}
                className="flex-row items-center"
              >
                <Text className="text-2xl mr-2">←</Text>
                <Text className="text-lg font-medium text-gray-700">Exit</Text>
              </TouchableOpacity>
              <Text className="text-lg font-bold text-gray-900">
                Quiz Session
              </Text>
              <View className="w-16" />
            </View>
          </View>
        </View>

        {/* Progress Section */}
        <View className="bg-white px-6 py-4 border-b border-gray-100">
          <Text className="text-center text-base font-medium text-gray-600 mb-3">
            Question {currentSession.currentQuestionIndex + 1} of {currentSession.questions.length}
          </Text>
          <View className="bg-gray-200 rounded-full h-2">
            <View
              className="bg-brand-primary rounded-full h-2"
              style={{ width: `${progress}%` }}
            />
          </View>
        </View>

        <View className="flex-1">
          {/* Quiz Question */}
          <View className="flex-1 px-6 py-6">
            <QuizQuestion
              question={currentQuestion}
              selectedAnswer={currentAnswer?.selectedAnswer ?? null}
              onSelectAnswer={handleAnswerSelect}
              className="flex-1"
            />
          </View>

          {/* Navigation */}
          <View className="px-6 py-4 bg-white border-t border-gray-100" style={{ paddingBottom: 34 }}>
            <View className="flex-row gap-3">
              <Button
                variant="outline"
                size="lg"
                onPress={handlePrevious}
                disabled={currentSession.currentQuestionIndex === 0}
                className="flex-1"
              >
                ← Previous
              </Button>

              {currentSession.currentQuestionIndex === currentSession.questions.length - 1 ? (
                <Button
                  key={`submit-${currentQuestion.id}-${hasAnsweredCurrent}`}
                  variant="primary"
                  size="lg"
                  onPress={hasAnsweredCurrent ? handleSubmit : () => {}}
                  className={`flex-1 ${!hasAnsweredCurrent ? 'opacity-50' : ''}`}
                >
                  Submit Quiz ✅
                </Button>
              ) : (
                <Button
                  key={`next-${currentQuestion.id}-${hasAnsweredCurrent}`}
                  variant="primary"
                  size="lg"
                  onPress={hasAnsweredCurrent ? handleNext : () => {}}
                  className={`flex-1 ${!hasAnsweredCurrent ? 'opacity-50' : ''}`}
                >
                  Next →
                </Button>
              )}
            </View>
          </View>
        </View>
        </View>
      </View>
    </>
  );
}