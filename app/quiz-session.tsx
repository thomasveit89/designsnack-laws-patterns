import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Button } from '@/src/components/ui/Button';
import { QuizQuestion } from '@/src/components/quiz/QuizQuestion';
import { useQuiz } from '@/src/store/useQuiz';
import { usePrinciples } from '@/src/store/usePrinciples';
import { useFavorites } from '@/src/store/useFavorites';

export default function QuizSessionScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode: 'all' | 'favorites' }>();
  const { principles } = usePrinciples();
  const { getFavoriteIds } = useFavorites();
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
    // Filter principles based on mode
    let filtered = [...principles];

    if (mode === 'favorites') {
      const favoriteIds = getFavoriteIds();
      filtered = principles.filter(p => favoriteIds.includes(p.id));
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

    await startNewQuiz(filtered, mode || 'all');
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
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center px-6">
          <ActivityIndicator size="large" color="#0EA5E9" className="mb-4" />
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            Generating Quiz Questions...
          </Text>
          <Text className="text-base text-gray-600 text-center">
            Our AI is creating personalized questions for you
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center px-6">
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
      </SafeAreaView>
    );
  }

  // No session state
  if (!currentSession) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center px-6">
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
      </SafeAreaView>
    );
  }

  const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
  const currentAnswer = currentSession.answers.find(a => a.questionId === currentQuestion.id);
  const hasAnsweredCurrent = currentAnswer !== undefined;
  const progress = ((currentSession.currentQuestionIndex + 1) / currentSession.questions.length) * 100;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-gray-50" edges={[]}>
        {/* Custom Header */}
        <View className="bg-white border-b border-gray-100">
          {/* Status Bar Area */}
          <View className="pt-12 pb-2">
            <View className="h-6" />
          </View>

          {/* Header Controls */}
          <View className="px-6 pb-4">
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
      </SafeAreaView>
    </>
  );
}