import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { QuizQuestion as QuizQuestionType } from '../../data/types';
import * as Haptics from 'expo-haptics';

interface QuizQuestionProps {
  question: QuizQuestionType;
  selectedAnswer: number | null;
  onSelectAnswer: (optionIndex: number) => void;
  showResult?: boolean;
  className?: string;
}

export function QuizQuestion({ 
  question, 
  selectedAnswer, 
  onSelectAnswer, 
  showResult = false,
  className = ''
}: QuizQuestionProps) {
  
  const handleSelectAnswer = (optionIndex: number) => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelectAnswer(optionIndex);
  };

  const getOptionStyle = (optionIndex: number) => {
    const baseStyle = "p-4 rounded-xl border mb-3";
    
    if (!showResult) {
      // Normal state - highlight selected answer
      return selectedAnswer === optionIndex
        ? `${baseStyle} bg-brand-primary border-brand-primary`
        : `${baseStyle} bg-white border-gray-200`;
    }
    
    // Show results state
    if (optionIndex === question.correctAnswer) {
      // Correct answer - always green
      return `${baseStyle} bg-green-100 border-green-500`;
    } else if (selectedAnswer === optionIndex && optionIndex !== question.correctAnswer) {
      // Wrong selected answer - red
      return `${baseStyle} bg-red-100 border-red-500`;
    } else {
      // Other options - gray
      return `${baseStyle} bg-gray-100 border-gray-300`;
    }
  };

  const getOptionTextStyle = (optionIndex: number) => {
    const baseStyle = "text-base font-medium";
    
    if (!showResult) {
      return selectedAnswer === optionIndex
        ? `${baseStyle} text-white`
        : `${baseStyle} text-gray-900`;
    }
    
    // Show results state
    if (optionIndex === question.correctAnswer) {
      return `${baseStyle} text-green-800`;
    } else if (selectedAnswer === optionIndex && optionIndex !== question.correctAnswer) {
      return `${baseStyle} text-red-800`;
    } else {
      return `${baseStyle} text-gray-700`;
    }
  };

  const getOptionIcon = (optionIndex: number) => {
    if (!showResult) return null;
    
    if (optionIndex === question.correctAnswer) {
      return <Text className="text-green-600 text-lg ml-2">✓</Text>;
    } else if (selectedAnswer === optionIndex && optionIndex !== question.correctAnswer) {
      return <Text className="text-red-600 text-lg ml-2">✗</Text>;
    }
    return null;
  };

  return (
    <View className={`${className}`}>
      {/* Question */}
      <View className="mb-6">
        <Text className="text-xl font-bold text-gray-900 leading-relaxed">
          {question.question}
        </Text>
      </View>

      {/* Options */}
      <View>
        {question.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleSelectAnswer(index)}
            disabled={showResult}
            className={getOptionStyle(index)}
            activeOpacity={0.7}
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-1 flex-row items-start">
                <View className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center mr-3 mt-0.5">
                  <Text className="text-sm font-semibold text-gray-700">
                    {String.fromCharCode(65 + index)}
                  </Text>
                </View>
                <Text className={`${getOptionTextStyle(index)} flex-1`} style={{ flexShrink: 1 }}>
                  {option}
                </Text>
              </View>
              {getOptionIcon(index) && (
                <View className="ml-2">
                  {getOptionIcon(index)}
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Explanation (only shown in result mode) */}
      {showResult && question.explanation && (
        <View className="mt-4 p-4 bg-blue-50 rounded-xl">
          <Text className="text-sm font-semibold text-blue-900 mb-2">
            💡 Explanation
          </Text>
          <Text className="text-sm text-blue-800">
            {question.explanation}
          </Text>
        </View>
      )}
    </View>
  );
}