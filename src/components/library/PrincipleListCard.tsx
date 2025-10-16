import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Principle } from '../../data/types';
import { FavoriteButton } from '../shared/FavoriteButton';
import { CategoryChip } from '../shared/CategoryChip';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getPrincipleEmoji } from '../../lib/image-placeholders';
import { getTypeLabel } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface PrincipleListCardProps {
  principle: Principle;
  onPress?: () => void;
  className?: string;
  isLocked?: boolean;
}

export function PrincipleListCard({
  principle,
  onPress,
  className,
  isLocked = false
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
        {/* Emoji or Lock */}
        {isLocked ? (
          <View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center">
            <IconSymbol name="lock.fill" size={20} color="#9CA3AF" />
          </View>
        ) : (
          <Text className="text-3xl">
            {emoji}
          </Text>
        )}

        {/* Content */}
        <View className="flex-1">
          {/* Header */}
          <View className="flex-row items-start justify-between mb-2">
            <View className="flex-1 mr-3">
              <View className="flex-row items-center gap-2 mb-1">
                <Text className="text-lg font-bold text-gray-900 leading-tight flex-1">
                  {principle.title}
                </Text>
                {isLocked && (
                  <View className="bg-blue-100 px-2 py-0.5 rounded-full">
                    <Text className="text-xs font-semibold text-blue-600">PRO</Text>
                  </View>
                )}
              </View>
              <Text className="text-base text-gray-600 leading-snug">
                {isLocked ? 'Unlock to view this principle' : principle.oneLiner}
              </Text>
            </View>
            {!isLocked && (
              <FavoriteButton
                principleId={principle.id}
                size="sm"
              />
            )}
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