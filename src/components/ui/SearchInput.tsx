import React from 'react';
import { View, TextInput, Text, InputAccessoryView, TouchableOpacity, Keyboard } from 'react-native';
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
  const inputAccessoryViewID = 'searchInputAccessory';

  const KeyboardToolbar = () => (
    <InputAccessoryView nativeID={inputAccessoryViewID}>
      <View className="bg-gray-100 border-t border-gray-200 px-4 py-2 flex-row justify-end">
        <TouchableOpacity
          onPress={() => Keyboard.dismiss()}
          className="bg-blue-500 px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-medium text-base">Done</Text>
        </TouchableOpacity>
      </View>
    </InputAccessoryView>
  );

  return (
    <>
      <View className={cn(
        'bg-white rounded-xl border border-gray-200 px-4',
        'flex-row items-center h-[48px]',
        className
      )}>
        <Text className="text-lg text-gray-400 mr-3">🔍</Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          className="flex-1 text-base text-gray-900"
          style={{ 
            height: 48,
            textAlignVertical: 'center',
            includeFontPadding: false,
            textAlign: 'left',
            paddingTop: 12,
            paddingBottom: 12,
            lineHeight: 20,
            fontSize: 16
          }}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          inputAccessoryViewID={inputAccessoryViewID}
        />
        {value.length > 0 && (
          <TouchableOpacity
            onPress={() => onChangeText('')}
            className="ml-2 w-6 h-6 rounded-full bg-gray-300 items-center justify-center"
          >
            <Text className="text-white text-xs font-bold">✕</Text>
          </TouchableOpacity>
        )}
      </View>
      <KeyboardToolbar />
    </>
  );
}