import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { MiniPlayer } from '@/src/components/MiniPlayer';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[(colorScheme as 'light' | 'dark') ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            backgroundColor: '#1c1c1e', // Dark theme background
            borderTopWidth: 0,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Discover',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="safari.fill" color={color} />, // compass.fill or safari.fill
          }}
        />
        <Tabs.Screen
          name="match"
          options={{
            title: 'Match',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="flame.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="buds"
          options={{
            title: 'Buds',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.2.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: 'Library',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="square.stack.3d.down.right.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: 'Chat',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="message.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.circle.fill" color={color} />,
          }}
        />
      </Tabs>
      <MiniPlayer />
    </>
  );
}
