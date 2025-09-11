import React from 'react';
import { View, TextInput, Text } from 'react-native';
import { cn } from '../../lib/utils';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ 
  value, 
  onChangeText, 
  placeholder = "Search principles...",
  className 
}: SearchInputProps) {
  return (
    <View className={cn(
      'bg-white rounded-xl border border-gray-200 px-4 py-3',
      'flex-row items-center',
      className
    )}>
      <Text className="text-lg text-gray-400 mr-3">🔍</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        className="flex-1 text-base text-gray-900"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
        returnKeyType="search"
      />
    </View>
  );
}