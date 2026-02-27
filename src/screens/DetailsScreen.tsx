import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    useGetMovieDetailsQuery,
    useGetTrackDetailsQuery,
    useGetArtistDetailsQuery,
    useGetAlbumDetailsQuery,
    useGetMangaDetailsQuery,
    useGetAnimeDetailsQuery,
} from '../store/api';

const { width, height } = Dimensions.get('window');

const DetailsScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { id, type } = params as { id: string; type: string };

    let data, error, isLoading;

    // Conditional hooks are not allowed in React components (Rules of Hooks).
    // We must call all hooks, but skip the ones we don't need.
    // Using 'skip' option for RTK Query.

    const skip = (t: string) => !id || type !== t;

    const movieQuery = useGetMovieDetailsQuery(id, { skip: skip('movie') });
    const trackQuery = useGetTrackDetailsQuery(id, { skip: skip('track') });
    const artistQuery = useGetArtistDetailsQuery(id, { skip: skip('artist') });
    const albumQuery = useGetAlbumDetailsQuery(id, { skip: skip('album') });
    const mangaQuery = useGetMangaDetailsQuery(id, { skip: skip('manga') });
    const animeQuery = useGetAnimeDetailsQuery(id, { skip: skip('anime') });

    switch (type) {
        case 'movie':
            ({ data, error, isLoading } = movieQuery);
            break;
        case 'track':
            ({ data, error, isLoading } = trackQuery);
            break;
        case 'artist':
            ({ data, error, isLoading } = artistQuery);
            break;
        case 'album':
            ({ data, error, isLoading } = albumQuery);
            break;
        case 'manga':
            ({ data, error, isLoading } = mangaQuery);
            break;
        case 'anime':
            ({ data, error, isLoading } = animeQuery);
            break;
        default:
            // Default to track or handle unknown type
            ({ data, error, isLoading } = trackQuery);
            break;
    }

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1E90FF" />
                <Text style={styles.loadingText}>Loading details...</Text>
            </View>
        );
    }

    if (error || !data) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Failed to load details.</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const content = data.data || data; // Adjust based on API response structure

    return (
        <ScrollView style={styles.container}>
            <Image
                source={{ uri: content.cover_url || content.image_url || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }}
                style={styles.coverImage}
                resizeMode="cover"
            />
            <View style={styles.detailsContainer}>
                <Text style={styles.title}>{content.name || content.title}</Text>
                <Text style={styles.subtitle}>{content.artist || content.director || content.author || type}</Text>

                {content.description && (
                    <Text style={styles.description}>{content.description}</Text>
                )}

                {/* Add more specific fields based on type */}
                <View style={styles.metaContainer}>
                    <Text style={styles.metaText}>Type: {type}</Text>
                    {content.year && <Text style={styles.metaText}>Year: {content.year}</Text>}
                    {content.genre && <Text style={styles.metaText}>Genre: {content.genre}</Text>}
                </View>

                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    loadingText: {
        color: 'white',
        marginTop: 10,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    errorText: {
        color: 'red',
        marginBottom: 20,
    },
    coverImage: {
        width: width,
        height: width, // Square aspect ratio or adjust as needed
    },
    detailsContainer: {
        padding: 20,
    },
    title: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        color: '#CCC',
        fontSize: 18,
        marginBottom: 20,
    },
    description: {
        color: 'white',
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 20,
    },
    metaContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 30,
    },
    metaText: {
        color: '#888',
        fontSize: 14,
        backgroundColor: '#222',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    closeButton: {
        backgroundColor: '#1E90FF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backButton: {
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 5,
    },
    backButtonText: {
        color: 'white',
    },
});

export default DetailsScreen;
