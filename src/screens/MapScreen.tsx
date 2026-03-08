import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { DesignSystem } from '../theme/design_system';
import { IconSymbol } from '@/components/ui/icon-symbol';

// Mocks the same data the Flutter `LoadPlayedTracksWithLocation()` relied on
const mockPlayedTracks = [
    { id: '1', name: 'Blinding Lights', artist: 'The Weeknd', latitude: 34.0522, longitude: -118.2437 },
    { id: '2', name: 'Shape of You', artist: 'Ed Sheeran', latitude: 40.7128, longitude: -74.0060 },
    { id: '3', name: 'Watermelon Sugar', artist: 'Harry Styles', latitude: 51.5074, longitude: -0.1278 },
    { id: '4', name: 'Dance Monkey', artist: 'Ed Sheeran', latitude: 48.8566, longitude: 2.3522 },
];

// Safe conditional import because react-native-maps may not run in Expo Web.
let MapView: any = null;
let Marker: any = null;
let Callout: any = null;

if (Platform.OS !== 'web') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Maps = require('react-native-maps');
    MapView = Maps.default;
    Marker = Maps.Marker;
    Callout = Maps.Callout;
}

const MapScreen = () => {
    const router = useRouter();
    const [tracks] = useState(mockPlayedTracks);
    const isLoading = false;

    // In the future:
    // const { data, error, isLoading } = useGetPlayedTracksWithLocationQuery();
    // useEffect(() => { if (data) setTracks(data); }, [data]);

    const mapRegion = {
        latitude: tracks.length > 0 ? tracks[0].latitude : 37.78825,
        longitude: tracks.length > 0 ? tracks[0].longitude : -122.4324,
        latitudeDelta: 60.0,
        longitudeDelta: 60.0,
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header Overlay */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <IconSymbol name="chevron.left" size={28} color={DesignSystem.colors.onSurface} />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.title}>Played Tracks Map</Text>
                    <Text style={styles.subtitle}>{tracks.length} Tracks plotted</Text>
                </View>
            </View>

            {/* Map Content */}
            <View style={styles.mapContainer}>
                {isLoading ? (
                    <ActivityIndicator size="large" color={DesignSystem.colors.primaryRed} />
                ) : Platform.OS === 'web' || !MapView ? (
                    <View style={styles.webFallback}>
                        <IconSymbol name="map.fill" size={64} color={DesignSystem.colors.textSecondary} />
                        <Text style={styles.webFallbackText}>Maps are currently not supported on the web platform.</Text>
                        <Text style={styles.webFallbackSubtext}>Please view on an iOS or Android device.</Text>
                    </View>
                ) : (
                    <MapView
                        style={styles.map}
                        initialRegion={mapRegion}
                        showsUserLocation
                        userInterfaceStyle='dark'
                    >
                        {tracks.map((track) => (
                            <Marker
                                key={track.id}
                                coordinate={{ latitude: track.latitude, longitude: track.longitude }}
                                pinColor={DesignSystem.colors.primaryRed}
                            >
                                <Callout>
                                    <View style={styles.callout}>
                                        <Text style={styles.calloutTitle}>{track.name}</Text>
                                        <Text style={styles.calloutArtist}>{track.artist}</Text>
                                    </View>
                                </Callout>
                            </Marker>
                        ))}
                    </MapView>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DesignSystem.colors.backgroundPrimary,
    },
    header: {
        position: 'absolute',
        top: 60,
        left: DesignSystem.spacing.md,
        right: DesignSystem.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: DesignSystem.colors.surfaceContainer,
        borderRadius: DesignSystem.radius.lg,
        padding: DesignSystem.spacing.sm,
        boxShadow: '0px 4px 10px rgba(0,0,0,0.15)',
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: DesignSystem.colors.surfaceContainerHighest,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: DesignSystem.spacing.sm,
    },
    headerContent: {
        flex: 1,
    },
    title: {
        color: DesignSystem.colors.onSurface,
        ...DesignSystem.typography.titleMedium,
        fontWeight: 'bold',
    },
    subtitle: {
        color: DesignSystem.colors.textSecondary,
        ...DesignSystem.typography.bodySmall,
    },
    mapContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    webFallback: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: DesignSystem.spacing.lg,
    },
    webFallbackText: {
        ...DesignSystem.typography.titleMedium,
        color: DesignSystem.colors.onSurface,
        textAlign: 'center',
        marginTop: DesignSystem.spacing.md,
    },
    webFallbackSubtext: {
        ...DesignSystem.typography.bodyMedium,
        color: DesignSystem.colors.textSecondary,
        textAlign: 'center',
        marginTop: DesignSystem.spacing.sm,
    },
    callout: {
        padding: DesignSystem.spacing.xs,
        minWidth: 120,
    },
    calloutTitle: {
        ...DesignSystem.typography.titleSmall,
        color: '#000',
        fontWeight: 'bold',
    },
    calloutArtist: {
        ...DesignSystem.typography.labelSmall,
        color: '#555',
    }
});

export default MapScreen;
