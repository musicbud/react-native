import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { usePlayer } from '../src/context/PlayerContext';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const PlayerScreen = () => {
    const router = useRouter();
    const { currentTrack, isPlaying, pauseTrack, resumeTrack, positionMillis, durationMillis, seekTo } = usePlayer();

    if (!currentTrack) {
        // If no track is playing, there's nothing to show here.
        return (
            <View style={styles.fallbackContainer}>
                <Text style={{ color: 'white' }}>No track is currently playing.</Text>
                <TouchableOpacity style={{ marginTop: 20 }} onPress={() => router.back()}>
                    <Text style={{ color: '#1E90FF', fontSize: 16 }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handlePlayPause = () => {
        if (isPlaying) {
            pauseTrack();
        } else {
            resumeTrack();
        }
    };

    const progressPct = durationMillis > 0 ? (positionMillis / durationMillis) : 0;

    const formatTime = (millis: number) => {
        const totalSeconds = Math.floor(millis / 1000);
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleProgressBarPress = (evt: any) => {
        const clickX = evt.nativeEvent.locationX;
        const barWidth = width - 60; // based on padding
        const percentage = clickX / barWidth;
        const seekPosition = percentage * durationMillis;
        seekTo(seekPosition);
    };

    return (
        <LinearGradient colors={['#2c2c2e', '#000']} style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
                    <Text style={styles.iconText}>⌄</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Now Playing</Text>
                <TouchableOpacity style={styles.iconButton}>
                    <Text style={styles.iconText}>⋮</Text>
                </TouchableOpacity>
            </View>

            {/* Main Art */}
            <View style={styles.artContainer}>
                <Image
                    source={{ uri: currentTrack.cover_url || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }}
                    style={styles.artwork}
                />
            </View>

            {/* Info */}
            <View style={styles.infoContainer}>
                <View style={styles.textWrapper}>
                    <Text style={styles.title} numberOfLines={1}>{currentTrack.name || 'Unknown Track'}</Text>
                    <Text style={styles.artist} numberOfLines={1}>{currentTrack.artist || 'Unknown Artist'}</Text>
                </View>
                <TouchableOpacity>
                    <Text style={styles.likeIcon}>❤️</Text>
                </TouchableOpacity>
            </View>

            {/* Scrubber */}
            <View style={styles.scrubberContainer}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.progressBarBg}
                    onPress={handleProgressBarPress}
                >
                    <View style={[styles.progressBarFill, { width: `${progressPct * 100}%` }]} />
                    {/* Thumb marker */}
                    <View style={[styles.thumb, { left: `${progressPct * 100}%` }]} />
                </TouchableOpacity>

                <View style={styles.timeLabels}>
                    <Text style={styles.timeText}>{formatTime(positionMillis)}</Text>
                    <Text style={styles.timeText}>{formatTime(durationMillis)}</Text>
                </View>
            </View>

            {/* Controls */}
            <View style={styles.controlsContainer}>
                <TouchableOpacity style={styles.smallControlBtn}>
                    <Text style={{ fontSize: 22 }}>🔀</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.mediumControlBtn}>
                    <Text style={{ fontSize: 28 }}>⏮</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.playPauseBtn} onPress={handlePlayPause}>
                    <Text style={{ fontSize: 36, color: 'black' }}>{isPlaying ? "⏸️" : "▶️"}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.mediumControlBtn}>
                    <Text style={{ fontSize: 28 }}>⏭</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.smallControlBtn}>
                    <Text style={{ fontSize: 22 }}>🔁</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footerSpacer} />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    fallbackContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 60, // Account for top notch
    },
    iconButton: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        color: 'white',
        fontSize: 28,
        fontWeight: '300',
        marginTop: -8, // Tweak alignment for standard unicode characters
    },
    headerTitle: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    artContainer: {
        alignItems: 'center',
        marginVertical: 40,
        paddingHorizontal: 30,
    },
    artwork: {
        width: width - 60,
        height: width - 60,
        borderRadius: 16,
        backgroundColor: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30,
        marginBottom: 30,
    },
    textWrapper: {
        flex: 1,
        marginRight: 20,
    },
    title: {
        color: 'white',
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    artist: {
        color: '#aaa',
        fontSize: 18,
        fontWeight: '500',
    },
    likeIcon: {
        fontSize: 26,
    },
    scrubberContainer: {
        paddingHorizontal: 30,
        marginBottom: 40,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 3,
        justifyContent: 'center',
        position: 'relative',
        paddingVertical: 10, // expanded hit area for finger
    },
    progressBarFill: {
        position: 'absolute',
        left: 0,
        height: 6,
        backgroundColor: 'white',
        borderRadius: 3,
    },
    thumb: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'white',
        position: 'absolute',
        marginLeft: -6, // center thumb exactly
    },
    timeLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    timeText: {
        color: '#888',
        fontSize: 12,
        fontVariant: ['tabular-nums'],
    },
    controlsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    smallControlBtn: {
        padding: 10,
    },
    mediumControlBtn: {
        padding: 10,
    },
    playPauseBtn: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    footerSpacer: {
        flex: 1,
    }
});

export default PlayerScreen;
