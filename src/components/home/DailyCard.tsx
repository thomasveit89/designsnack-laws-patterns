import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Principle } from '../../data/types';
import { FavoriteButton } from '../shared/FavoriteButton';
import { CategoryChip } from '../shared/CategoryChip';
import { Button } from '../ui/Button';
import { getPrincipleImage } from '../../lib/image-placeholders';
import { getTypeLabel } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface DailyCardProps {
  principle: Principle;
  onLearnMore?: () => void;
  className?: string;
}

export function DailyCard({ 
  principle, 
  onLearnMore,
  className 
}: DailyCardProps) {
  const emoji = getPrincipleImage(principle.id);

  return (
    <View 
      className={cn(
        'bg-white rounded-2xl p-6 shadow-sm border border-gray-100',
        'mx-6',
        className
      )}
    >
      {/* Header */}
      <View className="flex-row items-start justify-between mb-4">
        <View className="flex-1 mr-4">
          <Text className="text-sm font-medium text-gray-500 mb-1">
            Today's Law
          </Text>
          <Text className="text-xl font-bold text-gray-900 leading-tight">
            {principle.title}
          </Text>
        </View>
        <FavoriteButton 
          principleId={principle.id}
          size="md"
        />
      </View>

      {/* Type and Category */}
      <View className="flex-row items-center gap-2 mb-4">
        <View className="bg-brand-primary/10 px-3 py-1 rounded-full">
          <Text className="text-sm font-medium text-brand-primary">
            {getTypeLabel(principle.type)}
          </Text>
        </View>
        <CategoryChip 
          category={principle.category}
          size="sm"
        />
      </View>

      {/* Emoji Illustration */}
      <View className="items-center justify-center py-6">
        <Text className="text-6xl mb-2">
          {emoji}
        </Text>
        <Text className="text-2xl font-semibold text-gray-900 text-center mb-2">
          {principle.oneLiner}
        </Text>
      </View>

      {/* Definition */}
      <Text className="text-base text-gray-600 leading-relaxed mb-6">
        {principle.definition}
      </Text>

      {/* Quick Tips */}
      {principle.do.length > 0 && (
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-900 mb-2">
            ✅ Quick Do's:
          </Text>
          <View className="space-y-1">
            {principle.do.slice(0, 2).map((item, index) => (
              <Text key={index} className="text-sm text-gray-600">
                • {item}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* Actions */}
      <View className="flex-row gap-3">
        <Button 
          variant="primary"
          size="lg"
          onPress={onLearnMore}
          className="flex-1"
        >
          Learn More
        </Button>
      </View>

      {/* Tags */}
      {principle.tags.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
          {principle.tags.slice(0, 4).map((tag) => (
            <View 
              key={tag}
              className="bg-gray-100 px-2 py-1 rounded-md"
            >
              <Text className="text-xs text-gray-600">
                {tag}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}