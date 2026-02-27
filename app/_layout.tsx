import React from 'react';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../src/store';
import { PlayerProvider } from '../src/context/PlayerContext';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PlayerProvider>
        <Stack initialRouteName="OnboardingScreen">
          <Stack.Screen name="IntroductionScreen" options={{ headerShown: false }} />
          <Stack.Screen name="BudsScreen" options={{ headerShown: false }} />
          <Stack.Screen name="CardsScreen" options={{ headerShown: false }} />
          <Stack.Screen name="ChatScreen" options={{ headerShown: false }} />
          <Stack.Screen name="EventsScreen" options={{ headerShown: false }} />
          <Stack.Screen name="HomeScreen" options={{ headerShown: false }} />
          <Stack.Screen name="HomeAltScreen" options={{ headerShown: false }} />
          <Stack.Screen name="ProfileScreen" options={{ headerShown: false }} />
          <Stack.Screen name="StoriesScreen" options={{ headerShown: false }} />
          <Stack.Screen name="WatchTogetherScreen" options={{ headerShown: false }} />
          <Stack.Screen name="DiscoverScreen" options={{ headerShown: false }} />
          <Stack.Screen name="DiscoverAltScreen" options={{ headerShown: false }} />
          <Stack.Screen name="ChangePassScreen" options={{ headerShown: false }} />
          <Stack.Screen name="ChangePassAltScreen" options={{ headerShown: false }} />
          <Stack.Screen name="ChatsAltScreen" options={{ headerShown: false }} />
          <Stack.Screen name="CollectInfoScreen" options={{ headerShown: false }} />
          <Stack.Screen name="CollectInfoAlt1Screen" options={{ headerShown: false }} />
          <Stack.Screen name="CollectInfoAlt2Screen" options={{ headerShown: false }} />
          <Stack.Screen name="CollectInfoAlt3Screen" options={{ headerShown: false }} />
          <Stack.Screen name="EventScreen" options={{ headerShown: false }} />
          <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />
          <Stack.Screen name="LoginWrongPassScreen" options={{ headerShown: false }} />
          <Stack.Screen name="MatchHistoryScreen" options={{ headerShown: false }} />
          <Stack.Screen name="MatchingScreen" options={{ headerShown: false }} />
          <Stack.Screen name="ResendEmailScreen" options={{ headerShown: false }} />
          <Stack.Screen name="ResendEmailAltScreen" options={{ headerShown: false }} />
          <Stack.Screen name="SearchScreen" options={{ headerShown: false }} />
          <Stack.Screen name="SignUpScreen" options={{ headerShown: false }} />
          <Stack.Screen name="SignUpAltScreen" options={{ headerShown: false }} />
          <Stack.Screen name="UserProfileScreen" options={{ headerShown: false }} />
          <Stack.Screen name="UserProfileAltScreen" options={{ headerShown: false }} />
          <Stack.Screen name="WatchPartyScreen" options={{ headerShown: false }} />
          <Stack.Screen name="OnboardingScreen" options={{ headerShown: false }} />
          <Stack.Screen name="DetailsScreen" options={{ headerShown: false }} />
          <Stack.Screen name="PlayerScreen" options={{ presentation: 'modal', headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </PlayerProvider>
    </Provider>
  );
}
