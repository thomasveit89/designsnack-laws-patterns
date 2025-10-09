import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import React from 'react';
import * as Haptics from 'expo-haptics';

export default function TabLayout() {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index" onPress={handlePress}>
        <Label>Library</Label>
        <Icon sf="books.vertical.fill" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="quiz" onPress={handlePress}>
        <Label>Practice</Label>
        <Icon sf="lightbulb" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="about" onPress={handlePress}>
        <Label>About</Label>
        <Icon sf="info.circle" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
