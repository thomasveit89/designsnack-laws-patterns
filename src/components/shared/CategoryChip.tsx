import React from 'react';
import { View, Text } from 'react-native';
import { CATEGORY_COLORS } from '../../lib/image-placeholders';
import { cn } from '../../lib/utils';

interface CategoryChipProps {
  category: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function CategoryChip({ 
  category, 
  size = 'md',
  className 
}: CategoryChipProps) {
  const color = CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || '#64748B';
  
  const sizeStyles = {
    sm: 'px-2 py-1',
    md: 'px-3 py-1.5'
  };
  
  const textStyles = {
    sm: 'text-xs',
    md: 'text-sm'
  };

  return (
    <View 
      className={cn(
        'rounded-full items-center justify-center',
        sizeStyles[size],
        className
      )}
      style={{ backgroundColor: `${color}15` }} // 15% opacity
    >
      <Text 
        className={cn(
          'font-medium capitalize',
          textStyles[size]
        )}
        style={{ color }}
      >
        {category}
      </Text>
    </View>
  );
}