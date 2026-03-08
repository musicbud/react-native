import React from 'react';
import { Dimensions, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Ionicons } from '@expo/vector-icons';
import { mapJsonToStyles } from '../utils/styleMapper';
import { SafeImage } from '../components/common/SafeImage';

import { useGetContentDetailsQuery } from '../store/contentApi';
import { DesignSystem } from '../theme/design_system';
import { ModernButton } from '../components/common/ModernButton';

const { width } = Dimensions.get('window');

const DetailsScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { id, type } = params as { id: string; type: string };

    const { data, error, isLoading } = useGetContentDetailsQuery(
        { contentType: type, contentId: id },
        { skip: !id || !type }
    );

    const contentTemp = data?.data || data || {};
    const audioUrl = type === 'track' && contentTemp?.preview_url ? contentTemp.preview_url : null;
    const player = useAudioPlayer(audioUrl);
    const status = useAudioPlayerStatus(player);

    const isPlaying = status.playing;
    const duration = status.duration ? status.duration * 1000 : 0;
    const position = status.currentTime ? status.currentTime * 1000 : 0;

    const playAudio = () => {
        if (isPlaying) {
            player.pause();
        } else {
            player.play();
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={DesignSystem.colors.primaryRed} />
            </View>
        );
    }

    if (error || !data) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Failed to load content.</Text>
                <ModernButton text="Close" onPressed={() => router.back()} variant="secondary" />
            </View>
        );
    }

    const content = data.data || data;
    const coverUrl = content.cover_url || content.image_url || content.cover || content.poster || 'https://via.placeholder.com/500/1e1e1e/888888?text=No+Cover';
    const title = content.name || content.title || 'Unknown Title';
    const sub = content.artist || content.director || content.author || content.studio || type;

    // Define JSON-derived pseudo layout base
    const screenStyleBase = mapJsonToStyles({
        properties: {
            layout: { padding: { top: 40, bottom: 20, left: 24, right: 24 } }
        }
    });

    const isPlayable = type === 'track' && content.preview_url;

    const formatTime = (millis: number) => {
        const totalSeconds = millis / 1000;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <ScrollView style={[styles.container, screenStyleBase as any]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-down" size={32} color={DesignSystem.colors.onSurface} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{type.toUpperCase()}</Text>
                <TouchableOpacity>
                    <Ionicons name="ellipsis-horizontal" size={24} color={DesignSystem.colors.onSurface} />
                </TouchableOpacity>
            </View>

            <View style={styles.artContainer}>
                <SafeImage source={{ uri: coverUrl }} style={styles.coverImage} />
            </View>

            <View style={styles.infoRow}>
                <View>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>{sub}</Text>
                </View>
                {isPlayable && (
                    <TouchableOpacity>
                        <Ionicons name="heart-outline" size={30} color={DesignSystem.colors.onSurface} />
                    </TouchableOpacity>
                )}
            </View>

            {isPlayable && (
                <View style={styles.playerContainer}>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: duration > 0 ? `${(position / duration) * 100}%` : '0%' }]} />
                    </View>
                    <View style={styles.timeRow}>
                        <Text style={styles.timeText}>{formatTime(position)}</Text>
                        <Text style={styles.timeText}>{formatTime(duration)}</Text>
                    </View>
                    <View style={styles.controlsRow}>
                        <TouchableOpacity>
                            <Ionicons name="shuffle" size={28} color={DesignSystem.colors.textSecondary} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Ionicons name="play-skip-back" size={36} color={DesignSystem.colors.onSurface} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={playAudio} style={styles.playButton}>
                            <Ionicons name={isPlaying ? "pause" : "play"} size={40} color={DesignSystem.colors.backgroundDark} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Ionicons name="play-skip-forward" size={36} color={DesignSystem.colors.onSurface} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Ionicons name="repeat" size={28} color={DesignSystem.colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {!isPlayable && content.description && (
                <Text style={styles.description}>{content.description}</Text>
            )}

            {!isPlayable && content.synopsis && (
                <Text style={styles.description}>{content.synopsis}</Text>
            )}

            <ModernButton
                text="Start a Watch Party"
                icon="people"
                onPressed={() => router.push({ pathname: '/WatchPartyScreen' as any, params: { id, type } })}
                variant="secondary"
                style={styles.watchTogetherBtn}
            />

            <View style={{ height: 100 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: DesignSystem.colors.backgroundPrimary },
    loadingContainer: { flex: 1, justifyContent: 'center', backgroundColor: DesignSystem.colors.backgroundPrimary },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: DesignSystem.colors.backgroundPrimary },
    errorText: { color: DesignSystem.colors.errorRed, fontSize: 16, marginBottom: DesignSystem.spacing.md },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: DesignSystem.spacing.lg, paddingHorizontal: DesignSystem.spacing.md, paddingTop: 60 },
    headerTitle: { color: DesignSystem.colors.textMuted, fontSize: 13, letterSpacing: 2, fontWeight: '700' },
    artContainer: { alignItems: 'center', marginBottom: DesignSystem.spacing.xl, boxShadow: '0px 4px 4px rgba(0,0,0,0.3)' },
    coverImage: { width: width - 60, height: width - 60, borderRadius: DesignSystem.radius.md },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: DesignSystem.spacing.lg, marginBottom: DesignSystem.spacing.lg },
    title: { color: DesignSystem.colors.onSurface, fontSize: 26, fontWeight: 'bold' },
    subtitle: { color: DesignSystem.colors.textMuted, fontSize: 18, marginTop: 4 },
    playerContainer: { paddingHorizontal: DesignSystem.spacing.lg },
    progressBarBg: { height: 4, backgroundColor: DesignSystem.colors.surfaceContainerHighest, borderRadius: DesignSystem.radius.sm, marginBottom: DesignSystem.spacing.xs },
    progressBarFill: { height: 4, backgroundColor: DesignSystem.colors.onSurface, borderRadius: DesignSystem.radius.sm },
    timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: DesignSystem.spacing.md },
    timeText: { color: DesignSystem.colors.textMuted, fontSize: 12 },
    controlsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    playButton: { width: 70, height: 70, borderRadius: 35, backgroundColor: DesignSystem.colors.onSurface, justifyContent: 'center', alignItems: 'center' },
    description: { color: DesignSystem.colors.textMuted, paddingHorizontal: DesignSystem.spacing.lg, fontSize: 15, lineHeight: 24, marginTop: DesignSystem.spacing.md },
    watchTogetherBtn: { marginHorizontal: DesignSystem.spacing.lg, marginTop: DesignSystem.spacing.lg },
});

export default DetailsScreen;
