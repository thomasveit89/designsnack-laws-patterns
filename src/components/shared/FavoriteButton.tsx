import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useFavorites } from '../../store/useFavorites';
import { cn } from '../../lib/utils';

interface FavoriteButtonProps {
  principleId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function FavoriteButton({ 
  principleId, 
  size = 'md',
  className 
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(principleId);

  const handleToggle = () => {
    toggleFavorite(principleId);
  };

  const sizeStyles = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-10 h-10 text-xl', 
    lg: 'w-12 h-12 text-2xl'
  };

  return (
    <TouchableOpacity
      onPress={handleToggle}
      className={cn(
        'items-center justify-center rounded-full',
        'active:scale-95 transition-transform',
        favorited ? 'bg-yellow-50' : 'bg-gray-50',
        sizeStyles[size],
        className
      )}
      activeOpacity={0.7}
      accessibilityLabel={favorited ? 'Remove from favorites' : 'Add to favorites'}
      accessibilityRole="button"
    >
      <Text className={cn(
        sizeStyles[size].split(' ')[2], // Extract text size class
        favorited ? 'text-yellow-500' : 'text-gray-400'
      )}>
        {favorited ? '⭐' : '☆'}
      </Text>
    </TouchableOpacity>
  );
}