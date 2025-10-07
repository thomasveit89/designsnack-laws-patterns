import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useQuiz } from '@/src/store/useQuiz';
import { usePrinciples } from '@/src/store/usePrinciples';
import { useFavorites } from '@/src/store/useFavorites';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { initializeSync } = useQuiz();
  const { principles, loadPrinciples } = usePrinciples();
  const { loadFavorites } = useFavorites();

  // Load favorites and principles when app starts
  useEffect(() => {
    loadFavorites();
    loadPrinciples().catch(error => {
      console.error('Failed to load principles:', error);
    });
  }, [loadPrinciples, loadFavorites]);

  // Initialize sync service when principles are loaded
  useEffect(() => {
    if (principles.length > 0) {
      const principleIds = principles.map(p => p.id);
      initializeSync(principleIds).catch(error => {
        console.warn('Failed to initialize sync service:', error);
      });
    }
  }, [principles.length, initializeSync]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="flashcards" options={{ headerShown: false }} />
        <Stack.Screen name="flashcard-session" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="dark" translucent={true} />
    </ThemeProvider>
  );
}
