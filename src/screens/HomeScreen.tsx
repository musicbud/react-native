import React from 'react';
import { SafeImage } from '../components/common/SafeImage';
import { View, Text, ImageProps, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  usePublicDiscoverRootV1DiscoverPublicGetQuery,
  usePublicTrendingV1DiscoverPublicTrendingGetQuery,
  useGetCurrentUserInfoV1AuthMeGetQuery,
  useGetConnectionsV1MatchingConnectionsGetQuery,
} from '../store/api';
import { LinearGradient } from 'expo-linear-gradient';
import { DesignSystem } from '../theme/design_system';
import { usePlayer } from '../context/PlayerContext';
import { MediaCarousel } from '../components/common/MediaCarousel';
import Animated, { FadeIn, FadeInDown, SlideInRight } from 'react-native-reanimated';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const HomeScreen = () => {
  const router = useRouter();
  const { playTrack } = usePlayer();

  const { data: discoverWrapper, error: discoverError, isLoading: isDiscoverLoading } = usePublicDiscoverRootV1DiscoverPublicGetQuery();
  const { data: trendingWrapper, error: trendingError, isLoading: isTrendingLoading } = usePublicTrendingV1DiscoverPublicTrendingGetQuery({ contentType: 'tracks' });
  const { data: myProfileWrapper, error: myProfileError, isLoading: isMyProfileLoading } = useGetCurrentUserInfoV1AuthMeGetQuery();
  const { data: connectionsWrapper } = useGetConnectionsV1MatchingConnectionsGetQuery({ limit: 10 });

  const isLoading = isDiscoverLoading || isTrendingLoading || isMyProfileLoading;

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#4ADE80" />
      </View>
    );
  }

  if (discoverError || trendingError || myProfileError) {
    return (
      <View className="flex-1 justify-center items-center bg-background px-8">
        <StatusBar barStyle="light-content" />
        <View className="w-20 h-20 bg-red-500/10 rounded-full items-center justify-center mb-6">
          <Ionicons name="alert-circle" size={40} color="#EF4444" />
        </View>
        <Text className="text-text-primary text-xl font-display font-bold text-center mb-2">Oops! Something went wrong</Text>
        <Text className="text-text-secondary text-base font-sans text-center mb-8">We couldn&apos;t load your music feed just now. Please try again.</Text>
        <TouchableOpacity
          className="bg-primary px-8 py-3 rounded-2xl shadow-lg"
          onPress={() => router.replace('/(tabs)')}
        >
          <Text className="text-white font-sans font-bold text-lg">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const myProfile = myProfileWrapper?.data;
  const userProfile = myProfile || {
    id: 'guest',
    username: 'Guest',
    first_name: 'Guest',
    avatar_url: 'https://ui-avatars.com/api/?name=Guest&background=random'
  };

  const storyData = connectionsWrapper?.data?.filter((user: any) => user && (user.avatar_url || user.image_url)) || [];
  const popularArtists = discoverWrapper?.data?.popular_artists || [];
  const trendingTracks = trendingWrapper?.data?.tracks || [];
  const featuredTrack = discoverWrapper?.data?.trending_tracks?.[0];

  const handleTrackPress = (track: any) => {
    playTrack(track);
    router.push({ pathname: '/DetailsScreen', params: { id: track.id, type: 'track' } });
  };

  const handleArtistPress = (artist: any) => {
    router.push({ pathname: '/DetailsScreen', params: { id: artist.id, type: 'artist' } });
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Modern Header */}
        <Animated.View
          entering={FadeIn.duration(800)}
          className="pt-16 px-6 pb-6 flex-row items-center justify-between"
        >
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.push('/UserProfileScreen')}
              className="relative"
            >
              <SafeImage
                source={{ uri: userProfile.avatar_url || 'https://ui-avatars.com/api/?name=Music+Bud&background=random' }}
                className="w-12 h-12 rounded-full border-2 border-primary/20"
              />
              <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-background" />
            </TouchableOpacity>
            <View className="ml-4">
              <Text className="text-text-secondary text-sm font-sans font-medium">{getGreeting()}</Text>
              <Text className="text-text-primary text-xl font-display font-bold">
                {userProfile.first_name || userProfile.username}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center space-x-3">
            <TouchableOpacity className="w-11 h-11 bg-background-layer1 rounded-2xl items-center justify-center border border-white/5">
              <Ionicons name="notifications-outline" size={22} color="#F8FAFC" />
            </TouchableOpacity>
            <TouchableOpacity className="w-11 h-11 bg-background-layer1 rounded-2xl items-center justify-center border border-white/5">
              <Ionicons name="search-outline" size={22} color="#F8FAFC" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Stories Section */}
        <Animated.View entering={SlideInRight.delay(200)} className="mb-10">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24 }}
            className="flex-row"
          >
            {/* My Status */}
            <TouchableOpacity className="items-center mr-6">
              <View className="w-18 h-18 rounded-full border-2 border-dashed border-white/20 p-1 justify-center items-center relative">
                <SafeImage
                  source={{ uri: userProfile.avatar_url || 'https://ui-avatars.com/api/?name=Music+Bud&background=random' }}
                  className="w-full h-full rounded-full opacity-60"
                />
                <View className="absolute bg-primary w-6 h-6 rounded-full items-center justify-center border-2 border-background">
                  <Ionicons name="add" size={18} color="white" />
                </View>
              </View>
              <Text className="text-text-secondary text-[11px] font-sans mt-2">My Stories</Text>
            </TouchableOpacity>

            {/* Friend Stories */}
            {storyData.map((item: any, index: number) => (
              <TouchableOpacity key={item.id} className="items-center mr-6">
                <LinearGradient
                  colors={[DesignSystem.colors.primary, DesignSystem.colors.secondary]}
                  className="w-18 h-18 rounded-full p-1 justify-center items-center"
                >
                  <View className="w-full h-full rounded-full border-2 border-background overflow-hidden p-0.5 bg-background">
                    <SafeImage
                      source={{ uri: item.avatar_url || item.image_url || 'https://ui-avatars.com/api/?name=' + (item.username || 'Friend') }}
                      className="w-full h-full rounded-full"
                    />
                  </View>
                </LinearGradient>
                <Text className="text-text-secondary text-[11px] font-sans mt-2" numberOfLines={1}>
                  {item.first_name || item.username}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Featured Hero Card */}
        {featuredTrack && (
          <Animated.View
            entering={FadeInDown.springify().delay(300)}
            className="px-6 mb-10"
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => handleTrackPress(featuredTrack)}
              className="relative h-64 w-full rounded-[40px] overflow-hidden shadow-2xl"
            >
              <SafeImage
                source={{ uri: featuredTrack.cover_url || featuredTrack.image_url || 'https://ui-avatars.com/api/?name=' + (featuredTrack?.name || 'Track').replace(' ', '+') + '&background=random' }}
                className="w-full h-full bg-background-layer1"
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(15, 14, 18, 0.95)']}
                className="absolute bottom-0 left-0 right-0 h-40 justify-end p-8"
              >
                <View className="flex-row items-center mb-2">
                  <View style={{ backgroundColor: `${DesignSystem.colors.primary}33` }} className="px-3 py-1 rounded-full border border-primary/30">
                    <Text className="text-primary text-[10px] font-sans font-bold uppercase tracking-widest">Trending Now</Text>
                  </View>
                </View>
                <Text className="text-white text-3xl font-display font-bold leading-tight" numberOfLines={1}>
                  {featuredTrack.name}
                </Text>
                <Text className="text-white/60 text-lg font-sans font-medium mt-1">
                  {featuredTrack.artist}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Scrolling Sections */}
        <View className="space-y-2">
          <MediaCarousel
            title="Popular Artists"
            data={popularArtists}
            size="small"
            onItemPress={handleArtistPress}
            emptyText="No artists found on your feed."
          />

          <MediaCarousel
            title="Recently Played"
            data={trendingTracks}
            size="small"
            onItemPress={handleTrackPress}
            emptyText="Your history is empty."
          />
        </View>

      </ScrollView>
    </View>
  );
};

export default HomeScreen;