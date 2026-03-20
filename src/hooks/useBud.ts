import { useMemo, useCallback } from 'react';
import {
    useGetCompatibilityWithUserV1MatchingCompatibilityUserIdGetQuery,
    useGetBudProfileV1BudBudProfilePostMutation,
    useCommonLikedTracksV1BudBudLikedTracksPostMutation,
    useCommonLikedArtistsV1BudBudLikedArtistsPostMutation,
    useCommonLikedAlbumsV1BudBudLikedAlbumsPostMutation,
    useCommonLikedAioV1BudBudLikedAioPostMutation,
    useCommonTopArtistsV1BudBudTopArtistsPostMutation,
    useCommonTopTracksV1BudBudTopTracksPostMutation,
} from '../store/api';

interface UseBudOptions {
    budUserId?: string;
}

/**
 * useBud – Provides "Bud" (music companion) feature data.
 * Handles compatibility scores, common music tastes, and shared listening data between two users.
 */
export const useBud = ({ budUserId }: UseBudOptions = {}) => {
    // Compatibility score (requires a target userId)
    const {
        data: compatibilityWrapper,
        isLoading: isCompatibilityLoading,
        refetch: refetchCompatibility,
    } = useGetCompatibilityWithUserV1MatchingCompatibilityUserIdGetQuery(
        { userId: budUserId! },
        { skip: !budUserId }
    );

    // Bud comparison mutations
    const [getBudProfileMutation, { isLoading: isFetchingBudProfile }] = useGetBudProfileV1BudBudProfilePostMutation();
    const [getCommonLikedTracksMutation, { isLoading: isFetchingCommonTracks }] = useCommonLikedTracksV1BudBudLikedTracksPostMutation();
    const [getCommonLikedArtistsMutation] = useCommonLikedArtistsV1BudBudLikedArtistsPostMutation();
    const [getCommonLikedAlbumsMutation] = useCommonLikedAlbumsV1BudBudLikedAlbumsPostMutation();
    const [getCommonLikedAioMutation] = useCommonLikedAioV1BudBudLikedAioPostMutation();
    const [getCommonTopArtistsMutation] = useCommonTopArtistsV1BudBudTopArtistsPostMutation();
    const [getCommonTopTracksMutation] = useCommonTopTracksV1BudBudTopTracksPostMutation();

    // Extract compatibility data
    const compatibility = useMemo(() => (compatibilityWrapper as any)?.data || compatibilityWrapper, [compatibilityWrapper]);
    const compatibilityScore = useMemo(() => compatibility?.score ?? compatibility?.compatibility_score ?? null, [compatibility]);

    // Actions
    const fetchBudProfile = useCallback(async (userId?: string) => {
        const targetId = userId || budUserId;
        if (!targetId) return null;
        try {
            return await getBudProfileMutation({ budRequest: { bud_id: targetId } }).unwrap();
        } catch (e) {
            console.error('[useBud] fetchBudProfile error:', e);
            throw e;
        }
    }, [budUserId, getBudProfileMutation]);

    const fetchCommonTracks = useCallback(async (userId?: string) => {
        const targetId = userId || budUserId;
        if (!targetId) return [];
        try {
            const result = await getCommonLikedTracksMutation({ budRequest: { bud_id: targetId } }).unwrap();
            return (result as any)?.data || result || [];
        } catch (e) {
            console.error('[useBud] fetchCommonTracks error:', e);
            return [];
        }
    }, [budUserId, getCommonLikedTracksMutation]);

    const fetchCommonArtists = useCallback(async (userId?: string) => {
        const targetId = userId || budUserId;
        if (!targetId) return [];
        try {
            const result = await getCommonLikedArtistsMutation({ budRequest: { bud_id: targetId } }).unwrap();
            return (result as any)?.data || result || [];
        } catch (e) {
            console.error('[useBud] fetchCommonArtists error:', e);
            return [];
        }
    }, [budUserId, getCommonLikedArtistsMutation]);

    const fetchCommonAlbums = useCallback(async (userId?: string) => {
        const targetId = userId || budUserId;
        if (!targetId) return [];
        try {
            const result = await getCommonLikedAlbumsMutation({ budRequest: { bud_id: targetId } }).unwrap();
            return (result as any)?.data || result || [];
        } catch (e) {
            console.error('[useBud] fetchCommonAlbums error:', e);
            return [];
        }
    }, [budUserId, getCommonLikedAlbumsMutation]);

    const fetchAllCommonContent = useCallback(async (userId?: string) => {
        const targetId = userId || budUserId;
        if (!targetId) return null;
        try {
            const result = await getCommonLikedAioMutation({ budRequest: { bud_id: targetId } }).unwrap();
            return (result as any)?.data || result;
        } catch (e) {
            console.error('[useBud] fetchAllCommonContent error:', e);
            return null;
        }
    }, [budUserId, getCommonLikedAioMutation]);

    const fetchCommonTopArtists = useCallback(async (userId?: string) => {
        const targetId = userId || budUserId;
        if (!targetId) return [];
        try {
            const result = await getCommonTopArtistsMutation({ budRequest: { bud_id: targetId } }).unwrap();
            return (result as any)?.data || result || [];
        } catch (e) {
            console.error('[useBud] fetchCommonTopArtists error:', e);
            return [];
        }
    }, [budUserId, getCommonTopArtistsMutation]);

    const fetchCommonTopTracks = useCallback(async (userId?: string) => {
        const targetId = userId || budUserId;
        if (!targetId) return [];
        try {
            const result = await getCommonTopTracksMutation({ budRequest: { bud_id: targetId } }).unwrap();
            return (result as any)?.data || result || [];
        } catch (e) {
            console.error('[useBud] fetchCommonTopTracks error:', e);
            return [];
        }
    }, [budUserId, getCommonTopTracksMutation]);

    return {
        // Compatibility
        compatibility,
        compatibilityScore,
        isCompatibilityLoading,
        refetchCompatibility,

        // Loading
        isFetchingBudProfile,
        isFetchingCommonTracks,

        // Actions
        fetchBudProfile,
        fetchCommonTracks,
        fetchCommonArtists,
        fetchCommonAlbums,
        fetchAllCommonContent,
        fetchCommonTopArtists,
        fetchCommonTopTracks,
    };
};
