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
import { PremiumBanner } from '@/src/components/library/PremiumBanner';
import { SearchInput } from '@/src/components/ui/SearchInput';
import { CategoryChip } from '@/src/components/shared/CategoryChip';
import { LoadingSkeletons } from '@/src/components/ui/SkeletonLoader';
import { PremiumModal } from '@/src/components/PremiumModal';
import { usePrinciples } from '@/src/store/usePrinciples';
import { useFavorites } from '@/src/store/useFavorites';
import { usePurchase, isPrincipleLocked } from '@/src/store/usePurchase';
import { Principle } from '@/src/data/types';
import categoriesData from '@/src/data/categories.json';

type SortOption = 'alphabetical' | 'category' | 'favorites';
type CategoryFilter = 'all' | 'favorites' | string;

export default function LibraryScreen() {
  const { principles, loadPrinciples, isLoading } = usePrinciples();
  const { loadFavorites, getFavoriteIds, getFavoriteCount } = useFavorites();
  const { isPremium, isBannerDismissed, dismissBanner } = usePurchase();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
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

  // Helper function to get category counts
  const getCategoryCount = (categoryLabel: string) => {
    if (categoryLabel === 'All') {
      return searchQuery.trim() ?
        principles.filter(principle =>
          principle.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
          principle.oneLiner.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
          principle.definition.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
          principle.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase().trim()))
        ).length : principles.length;
    }

    if (categoryLabel.startsWith('Favorites')) {
      return getFavoriteCount();
    }

    const categoryMap: Record<string, string> = {
      'Attention': 'attention',
      'Memory': 'memory',
      'Decision Making': 'decisions',
      'Usability': 'usability',
      'Persuasion': 'persuasion',
      'Visual Design': 'visual'
    };

    const actualCategory = categoryMap[categoryLabel];
    if (!actualCategory) return 0;

    let categoryPrinciples = principles.filter(principle => principle.category === actualCategory);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      categoryPrinciples = categoryPrinciples.filter(principle =>
        principle.title.toLowerCase().includes(query) ||
        principle.oneLiner.toLowerCase().includes(query) ||
        principle.definition.toLowerCase().includes(query) ||
        principle.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return categoryPrinciples.length;
  };

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

  const handlePrinciplePress = (principle: Principle, index: number) => {
    const isLocked = isPrincipleLocked(index, isPremium);
    if (isLocked) {
      setShowPremiumModal(true);
    } else {
      router.push(`/principle/${principle.id}`);
    }
  };

  const renderItem = ({ item, index }: { item: Principle; index: number }) => {
    const isLocked = isPrincipleLocked(index, isPremium);
    return (
      <View className="px-5 mb-0">
        <PrincipleListCard
          principle={item}
          onPress={() => handlePrinciplePress(item, index)}
          isLocked={isLocked}
        />
      </View>
    );
  };

  const renderListHeader = () => {
    // Show banner if user is not premium and hasn't dismissed it
    const shouldShowBanner = !isPremium && !isBannerDismissed;

    if (!shouldShowBanner) {
      return null;
    }

    return (
      <PremiumBanner
        onPress={() => setShowPremiumModal(true)}
        onDismiss={dismissBanner}
      />
    );
  };

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
        className="absolute top-0 left-0 right-0 z-10 bg-gray-50"
        onLayout={onHeaderLayout}
      >
        <View className="px-5 pb-0 pt-6">
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
            className="mb-6"
            contentContainerStyle={{ paddingHorizontal: 0 }}
          >
            <View className="flex-row gap-2">
              <CategoryChip
                category={`All (${getCategoryCount('All')})`}
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
              {categoriesData.map((category) => {
                const count = getCategoryCount(category.label);
                return (
                  <CategoryChip
                    key={category.id}
                    category={`${category.label} (${count})`}
                    size="md"
                    selected={categoryFilter === category.label}
                    onPress={() => setCategoryFilter(category.label)}
                  />
                );
              })}
            </View>
          </ScrollView>
        </View>
      </Animated.View>

      {/* Scrollable Content */}
      <FlatList
        data={filteredPrinciples}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={isLoading ? renderLoadingState() : renderEmptyState()}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 170 + insets.top, // Space for header + safe area
          paddingBottom: Math.max(insets.bottom, 20)
        }}
        initialNumToRender={10}
        windowSize={10}
      />

      <PremiumModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />
    </SafeAreaView>
  );
}
