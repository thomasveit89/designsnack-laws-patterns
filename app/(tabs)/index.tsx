import React, { useState, useMemo, useEffect } from 'react';
import { View, ScrollView, Text, FlatList } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { PrincipleListCard } from '@/src/components/library/PrincipleListCard';
import { SearchInput } from '@/src/components/ui/SearchInput';
import { CategoryChip } from '@/src/components/shared/CategoryChip';
import { usePrinciples } from '@/src/store/usePrinciples';
import { useFavorites } from '@/src/store/useFavorites';
import { Principle } from '@/src/data/types';
import categoriesData from '@/src/data/categories.json';

type SortOption = 'alphabetical' | 'category' | 'favorites';
type CategoryFilter = 'all' | 'favorites' | string;

export default function LibraryScreen() {
  const { principles, loadPrinciples } = usePrinciples();
  const { loadFavorites, getFavoriteIds, getFavoriteCount } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical');
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadPrinciples();
    loadFavorites();
  }, [loadPrinciples, loadFavorites]);

  // Filter and search principles
  const filteredPrinciples = useMemo(() => {
    let filtered = [...principles];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(principle => 
        principle.title.toLowerCase().includes(query) ||
        principle.oneLiner.toLowerCase().includes(query) ||
        principle.definition.toLowerCase().includes(query) ||
        principle.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      if (categoryFilter === 'favorites') {
        // Filter by favorites
        const favoriteIds = getFavoriteIds();
        filtered = filtered.filter(principle => favoriteIds.includes(principle.id));
      } else {
        // Map display labels to actual category values
        const categoryMap: Record<string, string> = {
          'Attention': 'attention',
          'Memory': 'memory', 
          'Decision Making': 'decisions',
          'Usability': 'usability'
        };
        const actualCategory = categoryMap[categoryFilter];
        if (actualCategory) {
          filtered = filtered.filter(principle => principle.category === actualCategory);
        }
      }
    }

    // Apply sorting
    switch (sortBy) {
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'category':
        filtered.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case 'favorites':
        // TODO: Implement favorites sorting when we have favorites data
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return filtered;
  }, [principles, searchQuery, categoryFilter, sortBy, getFavoriteIds]);

  const handlePrinciplePress = (principle: Principle) => {
    router.push(`/principle/${principle.id}`);
  };

  const renderPrinciple = ({ item }: { item: Principle }) => (
    <PrincipleListCard 
      key={item.id}
      principle={item}
      onPress={() => handlePrinciplePress(item)}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Library
          </Text>
          <Text className="text-base text-gray-600">
            Discover and explore UX principles and design laws
          </Text>
        </View>

        {/* Search */}
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search principles..."
          className="mb-6"
        />

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
          contentContainerStyle={{ paddingHorizontal: 0 }}
        >
          <View className="flex-row gap-2">
            <CategoryChip 
              category="All"
              size="md"
              selected={categoryFilter === 'all'}
              onPress={() => setCategoryFilter('all')}
            />
            <CategoryChip 
              category={getFavoriteCount() > 0 ? `Favorites (${getFavoriteCount()})` : 'Favorites'}
              size="md"
              selected={categoryFilter === 'favorites'}
              onPress={() => setCategoryFilter('favorites')}
            />
            {categoriesData.map((category) => (
              <CategoryChip 
                key={category.id}
                category={category.label}
                size="md"
                selected={categoryFilter === category.label}
                onPress={() => setCategoryFilter(category.label)}
              />
            ))}
          </View>
        </ScrollView>

        {/* Results Count */}
        <View className="mb-4">
          <Text className="text-sm text-gray-500">
            {filteredPrinciples.length} principle{filteredPrinciples.length !== 1 ? 's' : ''}
            {searchQuery && ` matching "${searchQuery}"`}
            {categoryFilter === 'favorites' && ` in Favorites`}
            {categoryFilter !== 'all' && categoryFilter !== 'favorites' && ` in ${categoryFilter}`}
          </Text>
        </View>

        {/* Principles List */}
        {filteredPrinciples.length > 0 ? (
          <View className="space-y-3">
            {filteredPrinciples.map((principle) => (
              <PrincipleListCard
                key={principle.id}
                principle={principle}
                onPress={() => handlePrinciplePress(principle)}
              />
            ))}
          </View>
        ) : (
          <View className="items-center justify-center py-12">
            <Text className="text-xl text-gray-400 mb-2">
              {categoryFilter === 'favorites' ? '⭐' : '🔍'}
            </Text>
            <Text className="text-lg font-medium text-gray-600 mb-1">
              {categoryFilter === 'favorites' ? 'No favorites yet' : 'No principles found'}
            </Text>
            <Text className="text-base text-gray-500 text-center">
              {categoryFilter === 'favorites'
                ? 'Tap the star icon on principles to add them to your favorites'
                : 'Try adjusting your search or filters'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
