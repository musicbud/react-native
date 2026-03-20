import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeImage } from './SafeImage';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { DesignSystem } from '../../theme/design_system';

interface TrackCardProps {
    track: any;
    onPress: () => void;
    onMorePress?: () => void;
    onLikePress?: () => void;
    index?: number;
    size?: 'small' | 'medium' | 'large';
}

export const TrackCard = ({ track, onPress, onMorePress, onLikePress, index = 0, size = 'medium' }: TrackCardProps) => {
    const cardWidth = size === 'small' ? 104 : size === 'large' ? 180 : 160;
    const imgHeight = size === 'small' ? 102 : size === 'large' ? 180 : 160;

    return (
        <Animated.View
            entering={FadeInDown.delay(index * 100).springify().damping(12)}
            style={{ marginRight: 16, width: cardWidth }}
        >
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={onPress}
                className="relative"
            >
                {/* Cover Art */}
                <View className="relative">
                    <SafeImage
                        source={{ uri: track.image || track.cover_url || track.image_url || 'https://ui-avatars.com/api/?name=Music+Bud&background=random' }}
                        style={{ width: cardWidth, height: imgHeight, borderRadius: 24, backgroundColor: DesignSystem.colors.surfaceContainerHighest }}
                    />

                    {/* Like button */}
                    <TouchableOpacity
                        onPress={onLikePress}
                        className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/30 items-center justify-center border border-white/10 backdrop-blur-md"
                    >
                        <Ionicons name="heart-outline" size={16} color="white" />
                    </TouchableOpacity>

                    {/* More button */}
                    <TouchableOpacity
                        onPress={onMorePress}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 items-center justify-center border border-white/10 backdrop-blur-md"
                    >
                        <Ionicons name="ellipsis-vertical" size={16} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Text Meta */}
                <View className="mt-3 px-1">
                    <Text
                        className="text-text-primary font-sans font-bold leading-tight"
                        style={{ fontSize: size === 'small' ? 12 : 16 }}
                        numberOfLines={1}
                    >
                        {track.name}
                    </Text>
                    <Text
                        className="text-text-secondary font-sans mt-0.5"
                        style={{ fontSize: size === 'small' ? 10 : 14 }}
                        numberOfLines={1}
                    >
                        {track.artist}
                    </Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};
