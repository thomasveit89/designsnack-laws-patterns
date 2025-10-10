import { NativeTabs, Label, Icon } from 'expo-router/unstable-native-tabs';
import React from 'react';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Library</Label>
        <Icon sf="books.vertical.fill" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="quiz">
        <Label>Practice</Label>
        <Icon sf="lightbulb" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="about">
        <Label>About</Label>
        <Icon sf="info.circle" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
