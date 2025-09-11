import React, { useState, useMemo, useEffect } from 'react';
import { View, ScrollView, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrincipleListCard } from '@/src/components/library/PrincipleListCard';
import { SearchInput } from '@/src/components/ui/SearchInput';
import { CategoryChip } from '@/src/components/shared/CategoryChip';
import { usePrinciples } from '@/src/store/usePrinciples';
import { Principle } from '@/src/data/types';
import categoriesData from '@/src/data/categories.json';

type SortOption = 'alphabetical' | 'category' | 'favorites';
type CategoryFilter = 'all' | string;

export default function LibraryScreen() {
  const { principles, loadPrinciples } = usePrinciples();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical');

  useEffect(() => {
    loadPrinciples();
  }, [loadPrinciples]);

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
  }, [principles, searchQuery, categoryFilter, sortBy]);

  const handlePrinciplePress = (principle: Principle) => {
    // TODO: Navigate to principle detail screen
    console.log('Navigate to principle:', principle.id);
  };

  const renderPrinciple = ({ item }: { item: Principle }) => (
    <PrincipleListCard 
      key={item.id}
      principle={item}
      onPress={() => handlePrinciplePress(item)}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 pt-4 pb-2">
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          Library
        </Text>
        
        {/* Search */}
        <SearchInput 
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search principles..."
          className="mb-4"
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
              className={categoryFilter === 'all' ? 'bg-brand-primary' : ''}
              onPress={() => setCategoryFilter('all')}
            />
            {categoriesData.map((category) => (
              <CategoryChip 
                key={category.id}
                category={category.label}
                size="md"
                className={categoryFilter === category.label ? 'opacity-100' : 'opacity-70'}
                onPress={() => setCategoryFilter(category.label)}
              />
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Results Count */}
      <View className="px-6 mb-2">
        <Text className="text-sm text-gray-500">
          {filteredPrinciples.length} principle{filteredPrinciples.length !== 1 ? 's' : ''}
          {searchQuery && ` matching "${searchQuery}"`}
          {categoryFilter !== 'all' && ` in ${categoryFilter}`}
        </Text>
      </View>

      {/* Principles List */}
      <FlatList 
        data={filteredPrinciples}
        renderItem={renderPrinciple}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingHorizontal: 24, 
          paddingBottom: 32 
        }}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Text className="text-xl text-gray-400 mb-2">🔍</Text>
            <Text className="text-lg font-medium text-gray-600 mb-1">
              No principles found
            </Text>
            <Text className="text-base text-gray-500 text-center">
              Try adjusting your search or filters
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
