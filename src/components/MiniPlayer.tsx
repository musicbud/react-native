import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { usePlayer } from '../context/PlayerContext';
import { useRouter } from 'expo-router';

// This component will sit at the bottom of the screens above the tab bar.
export const MiniPlayer = () => {
    const { currentTrack, isPlaying, pauseTrack, resumeTrack, positionMillis, durationMillis } = usePlayer();
    const router = useRouter();

    if (!currentTrack) return null;

    const handlePlayPause = () => {
        if (isPlaying) {
            pauseTrack();
        } else {
            resumeTrack();
        }
    };

    const progressPct = durationMillis > 0 ? (positionMillis / durationMillis) * 100 : 0;

    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.9}
            onPress={() => router.push('/PlayerScreen' as any)}
        >
            <View style={styles.content}>
                <Image
                    source={{ uri: currentTrack.cover_url || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }}
                    style={styles.cover}
                />
                <View style={styles.trackInfo}>
                    <Text style={styles.title} numberOfLines={1}>{currentTrack.name || 'Unknown Track'}</Text>
                    <Text style={styles.artist} numberOfLines={1}>{currentTrack.artist || 'Unknown Artist'}</Text>
                </View>
                <View style={styles.controls}>
                    <TouchableOpacity onPress={() => {/* Handle Like */ }} style={styles.controlBtn}>
                        <Text style={{ fontSize: 20 }}>❤️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlePlayPause} style={styles.controlBtn}>
                        <Text style={{ fontSize: 20 }}>{isPlaying ? "⏸️" : "▶️"}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progressPct}%` }]} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 80, // High enough to sit above tabs, adjust based on your tab bar height
        left: 10,
        right: 10,
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    cover: {
        width: 44,
        height: 44,
        borderRadius: 8,
        backgroundColor: '#333',
    },
    trackInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    title: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    artist: {
        color: '#aaa',
        fontSize: 12,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    controlBtn: {
        padding: 8,
        marginLeft: 5,
    },
    progressBarBg: {
        height: 3,
        backgroundColor: '#333',
        width: '100%',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#1E90FF',
    }
});
