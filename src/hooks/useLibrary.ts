import { useMemo, useCallback } from 'react';
import {
    useGetLibrarySummaryV1LibraryGetQuery,
    useGetLibraryTracksV1LibraryTracksGetQuery,
    useGetLibraryArtistsV1LibraryArtistsGetQuery,
    useGetLibraryAlbumsV1LibraryAlbumsGetQuery,
    useGetLibraryGenresV1LibraryGenresGetQuery,
    useGetLibraryRecentV1LibraryRecentGetQuery,
    useGetLibraryPlaylistsV1LibraryPlaylistsGetQuery,
    useGetMyPlaylistsV1PlaylistsPlaylistsMeGetQuery,
    useAddTrackToLibraryV1LibraryTracksTrackIdPostMutation,
    useRemoveTrackFromLibraryV1LibraryTracksTrackIdDeleteMutation,
    useCreatePlaylistV1LibraryPlaylistsPostMutation,
    useAddTrackToPlaylistV1LibraryPlaylistsPlaylistIdTracksPostMutation,
    useDeletePlaylistV1LibraryPlaylistsPlaylistIdDeleteMutation,
    usePostLibraryRecentV1LibraryRecentPostMutation,
} from '../store/api';

/**
 * useLibrary – Comprehensive hook for the user's music library.
 * Includes tracks, artists, albums, genres, playlists, and recently played.
 */
export const useLibrary = () => {
    // Queries
    const { data: summaryWrapper, isLoading: isSummaryLoading } = useGetLibrarySummaryV1LibraryGetQuery();
    const { data: tracksWrapper, isLoading: isTracksLoading, refetch: refetchTracks } = useGetLibraryTracksV1LibraryTracksGetQuery({ limit: 100, skip: 0 } as any);
    const { data: artistsWrapper, isLoading: isArtistsLoading } = useGetLibraryArtistsV1LibraryArtistsGetQuery();
    const { data: albumsWrapper, isLoading: isAlbumsLoading } = useGetLibraryAlbumsV1LibraryAlbumsGetQuery();
    const { data: genresWrapper } = useGetLibraryGenresV1LibraryGenresGetQuery();
    const { data: recentWrapper, isLoading: isRecentLoading, refetch: refetchRecent } = useGetLibraryRecentV1LibraryRecentGetQuery({ limit: 30 } as any);
    const { data: playlistsWrapper, isLoading: isPlaylistsLoading, refetch: refetchPlaylists } = useGetLibraryPlaylistsV1LibraryPlaylistsGetQuery();
    const { data: myPlaylistsWrapper, refetch: refetchMyPlaylists } = useGetMyPlaylistsV1PlaylistsPlaylistsMeGetQuery();

    // Mutations
    const [addTrackMutation, { isLoading: isAddingTrack }] = useAddTrackToLibraryV1LibraryTracksTrackIdPostMutation();
    const [removeTrackMutation] = useRemoveTrackFromLibraryV1LibraryTracksTrackIdDeleteMutation();
    const [createPlaylistMutation, { isLoading: isCreatingPlaylist }] = useCreatePlaylistV1LibraryPlaylistsPostMutation();
    const [addToPlaylistMutation] = useAddTrackToPlaylistV1LibraryPlaylistsPlaylistIdTracksPostMutation();
    const [deletePlaylistMutation] = useDeletePlaylistV1LibraryPlaylistsPlaylistIdDeleteMutation();
    const [logRecentMutation] = usePostLibraryRecentV1LibraryRecentPostMutation();

    // Safe extractions
    const summary = useMemo(() => (summaryWrapper as any)?.data || summaryWrapper, [summaryWrapper]);
    const tracks = useMemo(() => {
        const raw = (tracksWrapper as any)?.data || tracksWrapper;
        return Array.isArray(raw) ? raw : [];
    }, [tracksWrapper]);
    const artists = useMemo(() => {
        const raw = (artistsWrapper as any)?.data || artistsWrapper;
        return Array.isArray(raw) ? raw : [];
    }, [artistsWrapper]);
    const albums = useMemo(() => {
        const raw = (albumsWrapper as any)?.data || albumsWrapper;
        return Array.isArray(raw) ? raw : [];
    }, [albumsWrapper]);
    const genres = useMemo(() => {
        const raw = (genresWrapper as any)?.data || genresWrapper;
        return Array.isArray(raw) ? raw : [];
    }, [genresWrapper]);
    const recentlyPlayed = useMemo(() => {
        const raw = (recentWrapper as any)?.data || recentWrapper;
        return Array.isArray(raw) ? raw : [];
    }, [recentWrapper]);
    const playlists = useMemo(() => {
        const raw = (playlistsWrapper as any)?.data || playlistsWrapper;
        return Array.isArray(raw) ? raw : [];
    }, [playlistsWrapper]);
    const myPlaylists = useMemo(() => {
        const raw = (myPlaylistsWrapper as any)?.data || myPlaylistsWrapper;
        return Array.isArray(raw) ? raw : [];
    }, [myPlaylistsWrapper]);

    // Actions
    const addTrack = useCallback(async (trackId: string) => {
        try {
            return await addTrackMutation({ trackId }).unwrap();
        } catch (e) {
            console.error('[useLibrary] addTrack error:', e);
            throw e;
        }
    }, [addTrackMutation]);

    const removeTrack = useCallback(async (trackId: string) => {
        try {
            return await removeTrackMutation({ trackId }).unwrap();
        } catch (e) {
            console.error('[useLibrary] removeTrack error:', e);
            throw e;
        }
    }, [removeTrackMutation]);

    const createPlaylist = useCallback(async (name: string, description?: string) => {
        try {
            return await createPlaylistMutation({
                playlistCreate: { name, description }
            } as any).unwrap();
        } catch (e) {
            console.error('[useLibrary] createPlaylist error:', e);
            throw e;
        }
    }, [createPlaylistMutation]);

    const addTrackToPlaylist = useCallback(async (playlistId: string, trackId: string) => {
        try {
            return await addToPlaylistMutation({ playlistId, trackId } as any).unwrap();
        } catch (e) {
            console.error('[useLibrary] addTrackToPlaylist error:', e);
            throw e;
        }
    }, [addToPlaylistMutation]);

    const deletePlaylist = useCallback(async (playlistId: string) => {
        try {
            return await deletePlaylistMutation({ playlistId }).unwrap();
        } catch (e) {
            console.error('[useLibrary] deletePlaylist error:', e);
            throw e;
        }
    }, [deletePlaylistMutation]);

    const logRecentlyPlayed = useCallback(async (contentId: string, contentType: string) => {
        try {
            return await logRecentMutation({ librarySaveRecent: { content_id: contentId, content_type: contentType } } as any).unwrap();
        } catch (e) {
            // Non-critical - silently fail
            console.warn('[useLibrary] logRecentlyPlayed error:', e);
        }
    }, [logRecentMutation]);

    const refetchAll = useCallback(() => {
        refetchTracks();
        refetchRecent();
        refetchPlaylists();
        refetchMyPlaylists();
    }, [refetchTracks, refetchRecent, refetchPlaylists, refetchMyPlaylists]);

    return {
        // Data
        summary,
        tracks,
        artists,
        albums,
        genres,
        recentlyPlayed,
        playlists,
        myPlaylists,

        // Loading
        isSummaryLoading,
        isTracksLoading,
        isArtistsLoading,
        isAlbumsLoading,
        isRecentLoading,
        isPlaylistsLoading,
        isAddingTrack,
        isCreatingPlaylist,

        // Actions
        addTrack,
        removeTrack,
        createPlaylist,
        addTrackToPlaylist,
        deletePlaylist,
        logRecentlyPlayed,
        refetchAll,
        refetchTracks,
        refetchRecent,
        refetchPlaylists,
    };
};
