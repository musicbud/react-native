import React, { useState } from 'react';
import { SafeImage } from '../components/common/SafeImage';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, StatusBar } from 'react-native';
import { useGetMyPlaylistsV1PlaylistsPlaylistsMeGetQuery } from '../store/api';
import { DesignSystem } from '../theme/design_system';
import { ModernButton } from '../components/common/ModernButton';
import { ModernCard } from '../components/common/ModernCard';
import { IconSymbol } from '../../components/ui/icon-symbol';

const TABS = ['Playlists', 'Liked Songs', 'Downloads'];

const LibraryScreen = () => {
    const [selectedTab, setSelectedTab] = useState(TABS[0]);

    const {
        data: playlistsWrapper,
        isLoading: isPlaylistsLoading
    } = useGetMyPlaylistsV1PlaylistsPlaylistsMeGetQuery();

    const playlists = (playlistsWrapper as any)?.data || playlistsWrapper || [];

    const renderPlaylistCard = ({ item }: { item: any }) => (
        <View style={{ width: '48%', marginBottom: DesignSystem.spacing.md }}>
            <ModernCard variant="elevated" onTap={() => console.log('Open playlist', item.id)}>
                <SafeImage
                    source={{ uri: item.image_url || 'https://via.placeholder.com/150/1E1E1E/FFFFFF?text=Mix' }}
                    style={styles.playlistImage}
                />
                <View style={styles.playlistInfo}>
                    <Text style={styles.playlistName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.playlistDetails} numberOfLines={1}>
                        {item.owner_name || 'MusicBud'} • {item.tracks_count || 0} tracks
                    </Text>
                </View>
            </ModernCard>
        </View>
    );

    const renderTabContent = () => {
        if (selectedTab === 'Playlists') {
            if (isPlaylistsLoading) {
                return <ActivityIndicator size="large" color={DesignSystem.colors.primary} style={styles.loader} />;
            }
            if (playlists.length === 0) {
                return (
                    <View style={styles.emptyContainer}>
                        <IconSymbol name="music.note.list" size={48} color={DesignSystem.colors.textMuted} />
                        <Text style={styles.emptyText}>No playlists yet</Text>
                        <ModernButton
                            text="Create Playlist"
                            variant="outline"
                            onPressed={() => console.log('Create playlist pressed')}
                            style={{ marginTop: DesignSystem.spacing.md }}
                        />
                    </View>
                );
            }
            return (
                <FlatList
                    data={playlists}
                    keyExtractor={(item) => item.id}
                    renderItem={renderPlaylistCard}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    contentContainerStyle={{ padding: DesignSystem.spacing.md }}
                    scrollEnabled={false}
                />
            );
        }

        return (
            <View style={styles.emptyContainer}>
                <IconSymbol name="music.quarternote.3" size={48} color={DesignSystem.colors.textMuted} />
                <Text style={styles.emptyText}>Your {selectedTab.toLowerCase()} will appear here</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.screenTitle}>Library</Text>
                <TouchableOpacity style={styles.iconButton}>
                    <IconSymbol name="plus" size={24} color={DesignSystem.colors.onSurface} />
                </TouchableOpacity>
            </View>

            <View style={styles.tabsContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
                    {TABS.map((tab) => {
                        const isSelected = selectedTab === tab;
                        return (
                            <TouchableOpacity
                                key={tab}
                                style={[styles.tabButton, isSelected && styles.tabButtonActive]}
                                onPress={() => setSelectedTab(tab)}
                            >
                                <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {renderTabContent()}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DesignSystem.colors.backgroundPrimary,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: DesignSystem.spacing.md,
        paddingBottom: DesignSystem.spacing.sm,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    screenTitle: {
        color: DesignSystem.colors.onSurface,
        ...DesignSystem.typography.displaySmall,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: DesignSystem.colors.surfaceContainer,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabsContainer: {
        borderBottomWidth: 1,
        borderBottomColor: DesignSystem.colors.borderColor,
        paddingBottom: DesignSystem.spacing.sm,
    },
    tabsScroll: {
        paddingHorizontal: DesignSystem.spacing.md,
        gap: DesignSystem.spacing.sm,
    },
    tabButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: DesignSystem.colors.borderColor,
        backgroundColor: 'transparent',
    },
    tabButtonActive: {
        backgroundColor: DesignSystem.colors.primary,
        borderColor: DesignSystem.colors.primary,
    },
    tabText: {
        color: DesignSystem.colors.textSecondary,
        ...DesignSystem.typography.labelLarge,
    },
    tabTextActive: {
        color: DesignSystem.colors.onPrimary,
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    loader: {
        marginTop: 40,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
        paddingHorizontal: DesignSystem.spacing.lg,
    },
    emptyText: {
        color: DesignSystem.colors.textMuted,
        ...DesignSystem.typography.titleMedium,
        marginTop: DesignSystem.spacing.md,
        textAlign: 'center',
    },
    playlistImage: {
        width: '100%',
        aspectRatio: 1,
        borderTopLeftRadius: DesignSystem.radius.sm,
        borderTopRightRadius: DesignSystem.radius.sm,
        backgroundColor: DesignSystem.colors.surfaceContainerHighest,
    },
    playlistInfo: {
        padding: DesignSystem.spacing.sm,
    },
    playlistName: {
        color: DesignSystem.colors.onSurface,
        ...DesignSystem.typography.labelLarge,
        fontWeight: 'bold',
    },
    playlistDetails: {
        color: DesignSystem.colors.textSecondary,
        ...DesignSystem.typography.labelSmall,
        marginTop: 2,
    }
});

export default LibraryScreen;
