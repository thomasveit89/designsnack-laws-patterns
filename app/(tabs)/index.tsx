import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, ScrollView, Text, FlatList } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { PrincipleListCard } from '@/src/components/library/PrincipleListCard';
import { SearchInput } from '@/src/components/ui/SearchInput';
import { CategoryChip } from '@/src/components/shared/CategoryChip';
import { LoadingSkeletons } from '@/src/components/ui/SkeletonLoader';
import { usePrinciples } from '@/src/store/usePrinciples';
import { useFavorites } from '@/src/store/useFavorites';
import { Principle } from '@/src/data/types';
import categoriesData from '@/src/data/categories.json';

type SortOption = 'alphabetical' | 'category' | 'favorites';
type CategoryFilter = 'all' | 'favorites' | string;

export default function LibraryScreen() {
  const { principles, loadPrinciples, isLoading } = usePrinciples();
  const { loadFavorites, getFavoriteIds, getFavoriteCount } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical');
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Header animation
  const scrollY = useSharedValue(0);
  const headerHeight = useSharedValue(0);
  const lastScrollY = useRef(0);
  const isHeaderVisible = useSharedValue(true);

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
          'Usability': 'usability',
          'Persuasion': 'persuasion',
          'Visual Design': 'visual'
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

  const renderItem = ({ item }: { item: Principle }) => (
    <View className="px-5 mb-3">
      <PrincipleListCard
        principle={item}
        onPress={() => handlePrinciplePress(item)}
      />
    </View>
  );

  const renderEmptyState = () => (
    <View className="items-center justify-center py-12 px-5">
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
  );

  const renderLoadingState = () => (
    <View className="px-5">
      <LoadingSkeletons count={8} />
    </View>
  );

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const diff = currentScrollY - lastScrollY.current;

    // Show header when scrolling up or at the top
    if (diff < -5 || currentScrollY < 50) {
      if (!isHeaderVisible.value) {
        isHeaderVisible.value = true;
      }
    }
    // Hide header when scrolling down significantly
    else if (diff > 5 && currentScrollY > 100) {
      if (isHeaderVisible.value) {
        isHeaderVisible.value = false;
      }
    }

    lastScrollY.current = currentScrollY;
    scrollY.value = currentScrollY;
  };

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(isHeaderVisible.value ? 0 : -headerHeight.value, {
            duration: 250,
          }),
        },
      ],
    };
  });

  const onHeaderLayout = (event: any) => {
    headerHeight.value = event.nativeEvent.layout.height;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Animated Header */}
      <Animated.View
        style={[headerAnimatedStyle, { paddingTop: insets.top }]}
        className="absolute top-0 left-0 right-0 z-10 bg-gray-50 border-b border-gray-200"
        onLayout={onHeaderLayout}
      >
        <View className="px-5 pb-4 pt-6">
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
        </View>
      </Animated.View>

      {/* Scrollable Content */}
      <FlatList
        data={filteredPrinciples}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={isLoading ? renderLoadingState() : renderEmptyState()}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 230 + insets.top, // Space for header + safe area
          paddingBottom: Math.max(insets.bottom, 20)
        }}
        initialNumToRender={10}
        windowSize={10}
      />
    </SafeAreaView>
  );
}
