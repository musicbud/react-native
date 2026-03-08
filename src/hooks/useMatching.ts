import { useMemo, useCallback } from 'react';
import {
    useGetPotentialMatchesV1MatchingDiscoverGetQuery,
    useGetConnectionsV1MatchingConnectionsGetQuery,
    useSwipeUserV1MatchingSwipePostMutation,
} from '../store/api';

/**
 * Custom hook to encapsulate the Matching and Connections logic.
 * Handles fetching connections, potential buds for swiping, and making swipe actions.
 */
export const useMatching = () => {
    // Fetch Connections (Buds)
    const {
        data: connectionsWrapper,
        error: connectionsError,
        isLoading: isConnectionsLoading,
        refetch: refetchConnections
    } = useGetConnectionsV1MatchingConnectionsGetQuery({ limit: 100 }, {
        // Optionally poll for new connections
        pollingInterval: 15000
    });

    // Fetch Potential Matches (Discover/Swiping)
    const {
        data: potentialMatchesWrapper,
        error: potentialMatchesError,
        isLoading: isPotentialMatchesLoading,
        refetch: refetchPotentialMatches
    } = useGetPotentialMatchesV1MatchingDiscoverGetQuery({ limit: 20 });

    // Swipe Action
    const [swipeUserMutation, { isLoading: isSwipingUser }] = useSwipeUserV1MatchingSwipePostMutation();

    // Safe data extraction
    const connections = useMemo(() => {
        return (connectionsWrapper as any)?.data || connectionsWrapper || [];
    }, [connectionsWrapper]);

    const potentialMatches = useMemo(() => {
        return (potentialMatchesWrapper as any)?.data || potentialMatchesWrapper || [];
    }, [potentialMatchesWrapper]);

    // Actions
    const swipeAction = useCallback(async (userId: string, action: 'like' | 'pass' | 'super_like') => {
        try {
            const resultWrapper = await swipeUserMutation({
                swipeRequest: { user_id: userId, action }
            }).unwrap();

            const result = (resultWrapper as any)?.data || resultWrapper;
            // You could update local state here implicitly through RTK Query cache invalidation
            // by setting up tags in the api.ts, or just rely on refetch queries when needed.
            return result;
        } catch (e) {
            console.error('Failed to swipe user:', e);
            throw e;
        }
    }, [swipeUserMutation]);

    return {
        // Data
        connections,
        potentialMatches,

        // Loaders
        isConnectionsLoading,
        isPotentialMatchesLoading,
        isSwipingUser,

        // Errors
        connectionsError,
        potentialMatchesError,

        // Actions
        refetchConnections,
        refetchPotentialMatches,
        swipeAction
    };
};
