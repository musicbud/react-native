import { useMemo, useCallback } from 'react';
import {
    usePublicDiscoverRootV1DiscoverPublicGetQuery,
    usePublicTrendingV1DiscoverPublicTrendingGetQuery,
    usePublicGenresV1DiscoverPublicGenresGetQuery,
    useSearchContentV1SearchGetQuery,
    useGetSearchSuggestionsV1SearchSuggestionsGetQuery,
    useGetTrendingSearchesV1SearchTrendingGetQuery,
    useGetAllStoriesV1StoriesGetQuery,
    useGetAllEventsV1EventsGetQuery,
} from '../store/api';

interface UseContentOptions {
    /** Content type for trending: 'tracks' | 'artists' | 'albums' | 'movies' | 'manga' | 'anime' | 'all' */
    trendingType?: 'tracks' | 'all' | 'artists' | 'movies' | 'manga' | 'anime';
    /** Search query string (empty = disabled) */
    searchQuery?: string;
    /** Whether search is enabled */
    enableSearch?: boolean;
}

/**
 * useContent – Centralizes public content discovery data.
 * Aggregates discover feed, trending, genres, stories, events and search.
 */
export const useContent = ({
    trendingType = 'tracks' as 'tracks' | 'all' | 'artists' | 'movies' | 'manga' | 'anime',
    searchQuery = '',
    enableSearch = false,
}: UseContentOptions = {}) => {
    // Discovery
    const {
        data: discoverWrapper,
        isLoading: isDiscoverLoading,
        refetch: refetchDiscover,
        error: discoverError,
    } = usePublicDiscoverRootV1DiscoverPublicGetQuery();

    const {
        data: trendingWrapper,
        isLoading: isTrendingLoading,
        refetch: refetchTrending,
    } = usePublicTrendingV1DiscoverPublicTrendingGetQuery({ contentType: trendingType as any });

    const { data: genresWrapper } = usePublicGenresV1DiscoverPublicGenresGetQuery();

    // Stories
    const { data: storiesWrapper, isLoading: isStoriesLoading, refetch: refetchStories, error: storiesError } =
        useGetAllStoriesV1StoriesGetQuery({} as any);

    // Events
    const { data: eventsWrapper, isLoading: isEventsLoading, refetch: refetchEvents } =
        useGetAllEventsV1EventsGetQuery({ limit: 20, skip: 0 } as any);

    // Search
    const {
        data: searchWrapper,
        isLoading: isSearchLoading,
        isFetching: isSearchFetching,
    } = useSearchContentV1SearchGetQuery(
        { query: searchQuery } as any,
        { skip: !enableSearch || !searchQuery.trim() }
    );

    const { data: suggestionsWrapper } = useGetSearchSuggestionsV1SearchSuggestionsGetQuery(
        { query: searchQuery } as any,
        { skip: !enableSearch || searchQuery.length < 2 }
    );

    const { data: trendingSearchesWrapper } = useGetTrendingSearchesV1SearchTrendingGetQuery(
        undefined,
        { skip: !enableSearch }
    );

    // Safe extractions
    const discoverData = useMemo(() => (discoverWrapper as any)?.data || discoverWrapper, [discoverWrapper]);
    const popularArtists = useMemo(() => discoverData?.popular_artists || [], [discoverData]);
    const trendingTracks = useMemo(() => discoverData?.trending_tracks || [], [discoverData]);
    const featuredTrack = useMemo(() => trendingTracks[0] || null, [trendingTracks]);

    const trendingData = useMemo(() => {
        const raw = (trendingWrapper as any)?.data || trendingWrapper;
        if (Array.isArray(raw)) return raw;
        return raw?.tracks || raw?.artists || raw?.albums || [];
    }, [trendingWrapper]);

    const genres = useMemo(() => (genresWrapper as any)?.data || genresWrapper || [], [genresWrapper]);

    const stories = useMemo(() => {
        const raw = (storiesWrapper as any)?.data || storiesWrapper;
        return Array.isArray(raw) ? raw : [];
    }, [storiesWrapper]);

    const events = useMemo(() => {
        const raw = (eventsWrapper as any)?.data || eventsWrapper;
        return Array.isArray(raw) ? raw : [];
    }, [eventsWrapper]);

    const searchResults = useMemo(() => (searchWrapper as any)?.data || searchWrapper, [searchWrapper]);
    const suggestions = useMemo(() => (suggestionsWrapper as any)?.data || suggestionsWrapper || [], [suggestionsWrapper]);
    const trendingSearches = useMemo(() => (trendingSearchesWrapper as any)?.data || trendingSearchesWrapper || [], [trendingSearchesWrapper]);

    const refetchAll = useCallback(() => {
        refetchDiscover();
        refetchTrending();
        refetchStories();
        refetchEvents();
    }, [refetchDiscover, refetchTrending, refetchStories, refetchEvents]);

    return {
        // Discovery
        popularArtists,
        trendingTracks,
        featuredTrack,
        trendingData,
        genres,
        discoverData,

        // Social
        stories,
        events,

        // Search
        searchResults,
        suggestions,
        trendingSearches,

        // Loading
        isLoading: isDiscoverLoading || isTrendingLoading,
        isStoriesLoading,
        isEventsLoading,
        isSearchLoading: isSearchLoading || isSearchFetching,

        // Errors
        discoverError,
        storiesError,

        // Refetch
        refetchDiscover,
        refetchTrending,
        refetchStories,
        refetchEvents,
        refetchAll,
    };
};
