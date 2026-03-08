import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { usePlayer } from '../src/context/PlayerContext';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, useSharedValue, useAnimatedStyle, runOnJS, withTiming } from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { AudioVisualizer } from '../src/components/common/AudioVisualizer';

const { width } = Dimensions.get('window');

const PlayerScreen = () => {
    const router = useRouter();
    const { currentTrack, isPlaying, pauseTrack, resumeTrack, positionMillis, durationMillis, seekTo } = usePlayer();

    const SCRUBBER_WIDTH = width - 64; // Horizontal padding 32 * 2

    // Gestures and scrubbing state
    const isScrubbing = useSharedValue(false);
    const scrubPosition = useSharedValue(0);

    const progressPct = durationMillis > 0 ? (positionMillis / durationMillis) : 0;

    // Update local animated values continuously unless user is actively overriding them
    React.useEffect(() => {
        if (!isScrubbing.value) {
            scrubPosition.value = progressPct * SCRUBBER_WIDTH;
        }
    }, [progressPct, SCRUBBER_WIDTH, isScrubbing, scrubPosition]);

    const panGesture = Gesture.Pan()
        .onBegin((e) => {
            isScrubbing.value = true;
            scrubPosition.value = Math.max(0, Math.min(e.x, SCRUBBER_WIDTH));
        })
        .onUpdate((e) => {
            scrubPosition.value = Math.max(0, Math.min(e.x, SCRUBBER_WIDTH));
        })
        .onEnd(() => {
            const percentage = scrubPosition.value / SCRUBBER_WIDTH;
            const newMillis = percentage * durationMillis;
            runOnJS(seekTo)(newMillis);
            isScrubbing.value = false;
        });

    const animatedProgressStyle = useAnimatedStyle(() => {
        return {
            width: scrubPosition.value,
        };
    });

    const animatedThumbStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: scrubPosition.value }],
            scale: isScrubbing.value ? withTiming(1.3) : withTiming(1),
        };
    });

    const handlePlayPause = () => {
        if (isPlaying) {
            pauseTrack();
        } else {
            resumeTrack();
        }
    };

    const formatTime = (millis: number) => {
        const totalSeconds = Math.floor(millis / 1000);
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (!currentTrack) {
        return (
            <View className="flex-1 justify-center items-center bg-background">
                <Text className="text-text-primary text-lg font-sans">No track is currently playing.</Text>
                <TouchableOpacity className="mt-5 px-6 py-3 bg-primary rounded-full" onPress={() => router.back()}>
                    <Text className="text-white font-sans font-semibold">Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background">
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={['#1F2937', '#111827', '#030712']}
                className="flex-1 px-8 pt-16 pb-12"
            >
                {/* Header */}
                <Animated.View entering={FadeIn.duration(600)} className="flex-row justify-between items-center mb-8">
                    <TouchableOpacity
                        className="w-10 h-10 items-center justify-center rounded-full bg-white/10 border border-white/10"
                        onPress={() => router.back()}
                    >
                        <Ionicons name="chevron-down" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white/60 text-xs font-sans font-bold uppercase tracking-widest">
                        Now Playing
                    </Text>
                    <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-white/10 border border-white/10">
                        <Ionicons name="ellipsis-horizontal" size={20} color="white" />
                    </TouchableOpacity>
                </Animated.View>

                {/* Artwork */}
                <Animated.View
                    entering={FadeInDown.springify().delay(200)}
                    className="items-center justify-center mb-12"
                    style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.5, shadowRadius: 30 }}
                >
                    <Image
                        source={{ uri: currentTrack.cover_url || 'https://ui-avatars.com/api/?name=Music+Bud&background=random' }}
                        className="rounded-3xl bg-gray-800"
                        style={{ width: width - 64, height: width - 64 }}
                    />
                </Animated.View>

                {/* Track Info */}
                <Animated.View entering={FadeInDown.springify().delay(300)} className="flex-row justify-between items-end mb-8">
                    <View className="flex-1 pr-4">
                        <Text className="text-text-primary text-3xl font-display font-bold mb-2" numberOfLines={1}>
                            {currentTrack.name || 'Unknown Track'}
                        </Text>
                        <Text className="text-text-secondary text-xl font-sans font-medium mb-4" numberOfLines={1}>
                            {currentTrack.artist || 'Unknown Artist'}
                        </Text>
                        <View className="h-6 w-full flex-row items-center">
                            <AudioVisualizer isPlaying={isPlaying} width={width - 150} height={20} />
                        </View>
                    </View>
                    <TouchableOpacity className="w-12 h-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                        <Ionicons name="heart" size={24} color="#E11D48" />
                    </TouchableOpacity>
                </Animated.View>

                {/* Scrubber - React Native Gesture Handler Integration */}
                <Animated.View entering={FadeInDown.springify().delay(400)} className="mb-10">
                    <GestureDetector gesture={panGesture}>
                        <Animated.View className="h-10 justify-center relative bg-transparent">
                            <View className="h-1.5 bg-white/10 rounded-full w-full overflow-hidden pointer-events-none">
                                <Animated.View
                                    className="h-full bg-primary"
                                    style={animatedProgressStyle}
                                />
                            </View>
                            <Animated.View
                                className="absolute w-4 h-4 bg-white border-2 border-primary rounded-full -ml-2"
                                style={animatedThumbStyle}
                            />
                        </Animated.View>
                    </GestureDetector>

                    <View className="flex-row justify-between -mt-2">
                        <Text className="text-text-secondary text-xs font-sans tabular-nums">
                            {formatTime(positionMillis)}
                        </Text>
                        <Text className="text-text-secondary text-xs font-sans tabular-nums">
                            {formatTime(durationMillis)}
                        </Text>
                    </View>
                </Animated.View>

                {/* Controls */}
                <Animated.View
                    entering={FadeInDown.springify().delay(500)}
                    className="flex-row justify-between items-center px-4"
                >
                    <TouchableOpacity>
                        <Ionicons name="shuffle" size={24} color="rgba(255,255,255,0.5)" />
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Ionicons name="play-skip-back" size={32} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="w-20 h-20 bg-white items-center justify-center rounded-full shadow-2xl"
                        style={{ shadowColor: '#fff', shadowOpacity: 0.3, shadowRadius: 10 }}
                        onPress={handlePlayPause}
                    >
                        <Ionicons name={isPlaying ? "pause" : "play"} size={40} color="black" className={isPlaying ? "" : "ml-1"} />
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Ionicons name="play-skip-forward" size={32} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Ionicons name="repeat" size={24} color="rgba(255,255,255,0.5)" />
                    </TouchableOpacity>
                </Animated.View>

                {/* Additional Footer Actions */}
                <Animated.View
                    entering={FadeInDown.springify().delay(600)}
                    className="mt-auto flex-row justify-center space-x-12"
                >
                    <TouchableOpacity className="flex-row items-center space-x-2">
                        <Ionicons name="share-outline" size={20} color="rgba(255,255,255,0.6)" />
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center space-x-2">
                        <Ionicons name="list-outline" size={20} color="rgba(255,255,255,0.6)" />
                    </TouchableOpacity>
                </Animated.View>
            </LinearGradient>
        </View>
    );
};

export default PlayerScreen;

