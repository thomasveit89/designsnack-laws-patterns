import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { cn } from '../../lib/utils';
import * as Haptics from 'expo-haptics';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Button({ 
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onPress,
  children,
  className,
  ...props 
}: ButtonProps) {
  const handlePress = () => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };
  const baseStyles = [
    'flex-row items-center justify-center rounded-lg',
    // Size variants
    size === 'sm' && 'px-3 py-2 min-h-[32]',
    size === 'md' && 'px-4 py-3 min-h-[44]',
    size === 'lg' && 'px-6 py-4 min-h-[52]',
    // Color variants
    variant === 'primary' && 'bg-brand-primary',
    variant === 'secondary' && 'bg-gray-100',
    variant === 'ghost' && 'bg-transparent',
    variant === 'outline' && 'bg-transparent border border-gray-300',
    // Disabled state
    (disabled || loading) && 'opacity-50',
  ].filter(Boolean);

  const textStyles = [
    'font-medium text-center',
    // Size-based text
    size === 'sm' && 'text-sm',
    size === 'md' && 'text-base', 
    size === 'lg' && 'text-lg',
    // Color-based text
    variant === 'primary' && 'text-white',
    variant === 'secondary' && 'text-gray-900',
    variant === 'ghost' && 'text-brand-primary',
    variant === 'outline' && 'text-gray-900',
  ].filter(Boolean);

  return (
    <TouchableOpacity
      className={cn(...baseStyles, className)}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={variant === 'primary' ? 1.0 : 0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? 'white' : '#0EA5E9'} 
        />
      ) : (
        <Text className={cn(...textStyles)}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}