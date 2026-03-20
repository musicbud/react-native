import React from 'react';
import { FlatList, View, Text } from 'react-native';
import { TrackCard } from './TrackCard';
import { SectionHeader } from './SectionHeader';

interface MediaCarouselProps {
    title: string;
    data: any[];
    onItemPress: (item: any) => void;
    onItemMorePress?: (item: any) => void;
    onItemLikePress?: (item: any) => void;
    emptyText?: string;
    size?: 'small' | 'medium' | 'large';
}

export const MediaCarousel = ({
    title,
    data,
    onItemPress,
    onItemMorePress,
    onItemLikePress,
    emptyText = "No content available.",
    size = 'medium'
}: MediaCarouselProps) => {
    return (
        <View className="mb-8">
            <SectionHeader title={title} style={{ paddingHorizontal: 16 }} />
            <FlatList
                horizontal
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <TrackCard
                        track={item}
                        index={index}
                        size={size}
                        onPress={() => onItemPress(item)}
                        onMorePress={() => onItemMorePress?.(item)}
                        onLikePress={() => onItemLikePress?.(item)}
                    />
                )}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12 }}
                ListEmptyComponent={
                    <Text className="text-text-secondary font-sans italic py-6 text-center w-full px-10">
                        {emptyText}
                    </Text>
                }
            />
        </View>
    );
};
