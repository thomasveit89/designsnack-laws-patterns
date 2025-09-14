import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Principle } from '../../data/types';
import { FavoriteButton } from '../shared/FavoriteButton';
import { CategoryChip } from '../shared/CategoryChip';
import { getPrincipleEmoji } from '../../lib/image-placeholders';
import { getTypeLabel } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface PrincipleListCardProps {
  principle: Principle;
  onPress?: () => void;
  className?: string;
}

export function PrincipleListCard({ 
  principle, 
  onPress,
  className 
}: PrincipleListCardProps) {
  const emoji = getPrincipleEmoji(principle.title);

  return (
    <TouchableOpacity 
      onPress={onPress}
      className={cn(
        'bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3',
        className
      )}
      activeOpacity={1}
    >
      <View className="flex-row items-start gap-4">
        {/* Emoji */}
        <Text className="text-3xl">
          {emoji}
        </Text>
        
        {/* Content */}
        <View className="flex-1">
          {/* Header */}
          <View className="flex-row items-start justify-between mb-2">
            <View className="flex-1 mr-3">
              <Text className="text-lg font-bold text-gray-900 leading-tight mb-1">
                {principle.title}
              </Text>
              <Text className="text-base text-gray-600 leading-snug">
                {principle.oneLiner}
              </Text>
            </View>
            <FavoriteButton 
              principleId={principle.id}
              size="sm"
            />
          </View>
          
          {/* Chips */}
          <View className="flex-row items-center gap-2">
            <View className="bg-brand-primary/10 px-2.5 py-1 rounded-full">
              <Text className="text-xs font-medium text-brand-primary">
                {getTypeLabel(principle.type)}
              </Text>
            </View>
            <CategoryChip 
              category={principle.category}
              size="sm"
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}