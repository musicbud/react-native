// musicbud-expo/src/navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import all screens
import IntroductionScreen from '../screens/IntroductionScreen';
import BudsScreen from '../screens/BudsScreen';
import CardsScreen from '../screens/CardsScreen';
import ChatScreen from '../screens/ChatScreen';
import EventsScreen from '../screens/EventsScreen';
import HomeScreen from '../screens/HomeScreen';
import HomeAltScreen from '../screens/HomeAltScreen';
import ProfileScreen from '../screens/ProfileScreen';
import StoriesScreen from '../screens/StoriesScreen';
import WatchTogetherScreen from '../screens/WatchTogetherScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import DiscoverAltScreen from '../screens/DiscoverAltScreen';
import ChangePassScreen from '../screens/ChangePassScreen';
import ChangePassAltScreen from '../screens/ChangePassAltScreen';
import ChatsAltScreen from '../screens/ChatsAltScreen';
import CollectInfoScreen from '../screens/CollectInfoScreen';
import CollectInfoAlt1Screen from '../screens/CollectInfoAlt1Screen';
import CollectInfoAlt2Screen from '../screens/CollectInfoAlt2Screen';
import CollectInfoAlt3Screen from '../screens/CollectInfoAlt3Screen';
import EventScreen from '../screens/EventScreen';
import LoginScreen from '../screens/LoginScreen';
import LoginWrongPassScreen from '../screens/LoginWrongPassScreen';
import MatchHistoryScreen from '../screens/MatchHistoryScreen';
import MatchingScreen from '../screens/MatchingScreen';
import ResendEmailScreen from '../screens/ResendEmailScreen';
import ResendEmailAltScreen from '../screens/ResendEmailAltScreen';
import SearchScreen from '../screens/SearchScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SignUpAltScreen from '../screens/SignUpAltScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import UserProfileAltScreen from '../screens/UserProfileAltScreen';
import WatchPartyScreen from '../screens/WatchPartyScreen';
import OnboardingScreen from '../screens/OnboardingScreen';


const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Introduction">
      <Stack.Screen name="Introduction" component={IntroductionScreen} />
      <Stack.Screen name="Buds" component={BudsScreen} />
      <Stack.Screen name="Cards" component={CardsScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Events" component={EventsScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="HomeAlt" component={HomeAltScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Stories" component={StoriesScreen} />
      <Stack.Screen name="WatchTogether" component={WatchTogetherScreen} />
      <Stack.Screen name="Discover" component={DiscoverScreen} />
      <Stack.Screen name="DiscoverAlt" component={DiscoverAltScreen} />
      <Stack.Screen name="ChangePass" component={ChangePassScreen} />
      <Stack.Screen name="ChangePassAlt" component={ChangePassAltScreen} />
      <Stack.Screen name="ChatsAlt" component={ChatsAltScreen} />
      <Stack.Screen name="CollectInfo" component={CollectInfoScreen} />
      <Stack.Screen name="CollectInfoAlt1" component={CollectInfoAlt1Screen} />
      <Stack.Screen name="CollectInfoAlt2" component={CollectInfoAlt2Screen} />
      <Stack.Screen name="CollectInfoAlt3" component={CollectInfoAlt3Screen} />
      <Stack.Screen name="Event" component={EventScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="LoginWrongPass" component={LoginWrongPassScreen} />
      <Stack.Screen name="MatchHistory" component={MatchHistoryScreen} />
      <Stack.Screen name="Matching" component={MatchingScreen} />
      <Stack.Screen name="ResendEmail" component={ResendEmailScreen} />
      <Stack.Screen name="ResendEmailAlt" component={ResendEmailAltScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="SignUpAlt" component={SignUpAltScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="UserProfileAlt" component={UserProfileAltScreen} />
      <Stack.Screen name="WatchParty" component={WatchPartyScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    </Stack.Navigator>
  );
}

export default AppNavigator;