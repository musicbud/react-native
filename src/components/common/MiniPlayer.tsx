import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeImage } from './SafeImage';
import { usePlayer } from '../../context/PlayerContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AudioVisualizer } from './AudioVisualizer';
import { DesignSystem } from '../../theme/design_system';

export const MiniPlayer = () => {
    const { currentTrack, isPlaying, pauseTrack, resumeTrack } = usePlayer();
    const router = useRouter();

    if (!currentTrack) {
        return null;
    }

    const handlePlayPause = () => {
        if (isPlaying) {
            pauseTrack();
        } else {
            resumeTrack();
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push('/PlayerScreen')}
            className="absolute bottom-[90px] left-2 right-2 rounded-2xl overflow-hidden border border-surface-border shadow-2xl"
        >
            <LinearGradient
                colors={[DesignSystem.colors.surfaceContainerHigh + 'F2', DesignSystem.colors.surfaceContainer + 'F2']}
                className="flex-row items-center py-2 px-3 backdrop-blur-xl"
            >
                {/* Track Cover */}
                <SafeImage
                    source={{ uri: currentTrack.image || currentTrack.cover_url || currentTrack.image_url || 'https://ui-avatars.com/api/?name=Music+Bud&background=random' }}
                    className="w-12 h-12 rounded-lg mr-3"
                />

                {/* Track Info */}
                <View className="flex-1 justify-center">
                    <Text className="text-text-primary font-sans font-semibold text-sm mb-0.5" numberOfLines={1}>
                        {currentTrack.name}
                    </Text>
                    <Text className="text-text-secondary font-sans text-xs" numberOfLines={1}>
                        {currentTrack.artist}
                    </Text>
                </View>

                {/* Controls */}
                <View className="flex-row items-center ml-2">
                    <TouchableOpacity
                        onPress={handlePlayPause}
                        className="w-10 h-10 items-center justify-center rounded-full active:bg-white/10"
                    >
                        <Ionicons
                            name={isPlaying ? 'pause' : 'play'}
                            size={24}
                            color={DesignSystem.colors.textPrimary}
                            className={isPlaying ? "" : "ml-1"}
                        />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* High Performance Audio Visualizer */}
            <View className="w-full absolute bottom-[-4px] left-0 h-4 bg-transparent overflow-hidden opacity-70 pointer-events-none">
                <AudioVisualizer isPlaying={isPlaying} width={400} height={16} />
            </View>
        </TouchableOpacity>
    );
};
