import React from 'react';
import { SafeImage } from '../components/common/SafeImage';
import { View, Text, TouchableOpacity, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useGetMatchesV1MatchingMatchesGetQuery } from '../store/api';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { DesignSystem } from '../theme/design_system';

const MatchHistoryScreen = () => {
  const router = useRouter();
  const { data: matchHistoryWrapper, error: matchHistoryError, isLoading } = useGetMatchesV1MatchingMatchesGetQuery({});

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color={DesignSystem.colors.successGreen} />
      </View>
    );
  }

  if (matchHistoryError) {
    return (
      <View className="flex-1 justify-center items-center bg-background px-8">
        <View className="w-20 h-20 bg-red-500/10 rounded-full items-center justify-center mb-6">
          <Ionicons name="alert-circle" size={40} color={DesignSystem.colors.errorRed} />
        </View>
        <Text className="text-text-primary text-xl font-display font-bold text-center mb-2">Oops!</Text>
        <Text className="text-text-secondary text-base font-sans text-center">Failed to load match history.</Text>
      </View>
    );
  }

  const matches = matchHistoryWrapper?.data || [];

  const renderMatchCard = ({ item, index }: { item: any, index: number }) => {
    const avatarUrl = item.avatar_url || item.avatar
      || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.display_name || item.name || 'Bud')}&background=1a1a2e&color=fff&size=300`;
    const score = item.compatibility_score;

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 100).springify()}
        className="flex-1 mx-2 mb-4"
      >
        <TouchableOpacity
          className="aspect-[3/4] rounded-3xl overflow-hidden bg-background-layer1 shadow-lg border border-white/5"
          activeOpacity={0.9}
          onPress={() => router.push(`/UserProfileScreen/${item.id}` as any)}
        >
          <SafeImage source={{ uri: avatarUrl }} className="absolute w-full h-full" resizeMode="cover" />

          <LinearGradient
            colors={['transparent', DesignSystem.colors.backgroundDark]}
            className="absolute bottom-0 left-0 right-0 h-1/2 justify-end p-4"
          >
            <Text className="text-white text-base font-display font-bold" numberOfLines={1}>
              {item.display_name || item.name || item.username}
            </Text>
            <Text className="text-white/70 text-xs font-sans font-medium mt-0.5" numberOfLines={1}>
              {item.common_genre || 'Music match'}
            </Text>
          </LinearGradient>

          {score != null && (
            <View className="absolute top-3 right-3 bg-primary/90 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/20 shadow-sm">
              <Text className="text-background font-sans font-bold text-[10px]">{score}%</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1">
        <Animated.View entering={FadeIn.duration(400)} className="flex-row items-center justify-between px-6 pt-4 pb-6">
          <Text className="text-text-primary text-3xl font-display font-bold tracking-tight">Matches</Text>
          <View className="bg-background-layer2 rounded-full px-3 py-1.5 border border-surface-border">
            <Text className="text-text-secondary text-xs font-sans font-bold">{matches.length} total</Text>
          </View>
        </Animated.View>

        <FlatList
          data={matches}
          renderItem={renderMatchCard}
          keyExtractor={(item, index) => item.id || index.toString()}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Animated.View entering={FadeIn.delay(300)} className="items-center mt-20 px-8">
              <View className="w-24 h-24 bg-background-layer1 rounded-full items-center justify-center mb-6">
                <Ionicons name="heart" size={40} color={DesignSystem.colors.successGreen} opacity={0.8} />
              </View>
              <Text className="text-text-primary text-2xl font-display font-bold mb-3">No matches yet</Text>
              <Text className="text-text-secondary text-base font-sans text-center mb-8 leading-relaxed">
                Start swiping on the discovery feed to connect with other music lovers!
              </Text>
              <TouchableOpacity
                className="bg-primary px-8 py-3.5 rounded-full shadow-lg shadow-primary/30"
                onPress={() => router.push('/(tabs)/MatchingScreen' as any)}
              >
                <Text className="text-background font-sans font-bold text-lg">Find Buds</Text>
              </TouchableOpacity>
            </Animated.View>
          }
        />
      </SafeAreaView>
    </View>
  );
};

export default MatchHistoryScreen;