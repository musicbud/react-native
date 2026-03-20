import { useMemo, useCallback } from 'react';
import {
    useGetCurrentUserInfoV1AuthMeGetQuery,
    useGetMyProfileV1UsersProfileGetQuery,
    useUpdateUserProfileV1UsersProfilePutMutation,
    useGetUserPreferencesV1UsersPreferencesGetQuery,
    useUpdateUserPreferencesV1UsersPreferencesPutMutation,
    useGetMatchingPreferencesV1UsersMatchingPreferencesGetQuery,
    useUpdateMatchingPreferencesV1UsersMatchingPreferencesPutMutation,
    useGetUserStatsV1UsersStatsGetQuery,
    useGetUserInterestsV1UsersInterestsGetQuery,
    useAddUserInterestV1UsersInterestsCategoryInterestPostMutation,
    useRemoveUserInterestV1UsersInterestsCategoryInterestDeleteMutation,
    useGetRecentActivityV1UsersActivityRecentGetQuery,
    useGetPrivacySettingsV1UsersSettingsPrivacyGetQuery,
    useUpdatePrivacySettingsV1UsersSettingsPrivacyPutMutation,
    useGetNotificationSettingsV1UsersSettingsNotificationsGetQuery,
    useUpdateNotificationSettingsV1UsersSettingsNotificationsPutMutation,
} from '../store/api';

/**
 * useProfile - Central hub for everything related to the current user's profile.
 * Consolidates auth info, profile data, preferences, stats, interests, and settings.
 */
export const useProfile = () => {
    // Core identity queries
    const { data: authWrapper, isLoading: isAuthLoading } = useGetCurrentUserInfoV1AuthMeGetQuery();
    const { data: profileWrapper, isLoading: isProfileLoading, refetch: refetchProfile } = useGetMyProfileV1UsersProfileGetQuery();

    // Preferences & Settings
    const { data: prefsWrapper } = useGetUserPreferencesV1UsersPreferencesGetQuery();
    const { data: matchingPrefsWrapper } = useGetMatchingPreferencesV1UsersMatchingPreferencesGetQuery();
    const { data: privacyWrapper } = useGetPrivacySettingsV1UsersSettingsPrivacyGetQuery();
    const { data: notifWrapper } = useGetNotificationSettingsV1UsersSettingsNotificationsGetQuery();

    // Stats, interests, and activity
    const { data: statsWrapper } = useGetUserStatsV1UsersStatsGetQuery();
    const { data: interestsWrapper } = useGetUserInterestsV1UsersInterestsGetQuery();
    const { data: activityWrapper } = useGetRecentActivityV1UsersActivityRecentGetQuery({ limit: 20 });

    // Mutations
    const [updateProfileMutation, { isLoading: isUpdatingProfile }] = useUpdateUserProfileV1UsersProfilePutMutation();
    const [updatePrefsMutation] = useUpdateUserPreferencesV1UsersPreferencesPutMutation();
    const [updateMatchingPrefsMutation] = useUpdateMatchingPreferencesV1UsersMatchingPreferencesPutMutation();
    const [updatePrivacyMutation] = useUpdatePrivacySettingsV1UsersSettingsPrivacyPutMutation();
    const [updateNotifMutation] = useUpdateNotificationSettingsV1UsersSettingsNotificationsPutMutation();
    const [addInterestMutation] = useAddUserInterestV1UsersInterestsCategoryInterestPostMutation();
    const [removeInterestMutation] = useRemoveUserInterestV1UsersInterestsCategoryInterestDeleteMutation();

    // Safe data extraction with sensible fallbacks
    const authUser = useMemo(() => (authWrapper as any)?.data || authWrapper, [authWrapper]);
    const profile = useMemo(() => (profileWrapper as any)?.data || profileWrapper, [profileWrapper]);
    const preferences = useMemo(() => (prefsWrapper as any)?.data || prefsWrapper, [prefsWrapper]);
    const matchingPreferences = useMemo(() => (matchingPrefsWrapper as any)?.data || matchingPrefsWrapper, [matchingPrefsWrapper]);
    const privacySettings = useMemo(() => (privacyWrapper as any)?.data || privacyWrapper, [privacyWrapper]);
    const notifSettings = useMemo(() => (notifWrapper as any)?.data || notifWrapper, [notifWrapper]);
    const stats = useMemo(() => (statsWrapper as any)?.data || statsWrapper, [statsWrapper]);
    const interests = useMemo(() => (interestsWrapper as any)?.data || interestsWrapper || [], [interestsWrapper]);
    const recentActivity = useMemo(() => (activityWrapper as any)?.data || activityWrapper || [], [activityWrapper]);

    // Merged user object (auth + profile details)
    const user = useMemo(() => ({
        ...authUser,
        ...profile,
    }), [authUser, profile]);

    // Actions
    const updateProfile = useCallback(async (payload: Record<string, unknown>) => {
        try {
            const result = await updateProfileMutation({ userProfileUpdate: payload } as any).unwrap();
            return result;
        } catch (e) {
            console.error('[useProfile] updateProfile error:', e);
            throw e;
        }
    }, [updateProfileMutation]);

    const updatePreferences = useCallback(async (payload: Record<string, unknown>) => {
        try {
            return await updatePrefsMutation({ userPreferencesUpdate: payload } as any).unwrap();
        } catch (e) {
            console.error('[useProfile] updatePreferences error:', e);
            throw e;
        }
    }, [updatePrefsMutation]);

    const updateMatchingPreferences = useCallback(async (payload: Record<string, unknown>) => {
        try {
            return await updateMatchingPrefsMutation({ matchingPreferencesUpdate: payload } as any).unwrap();
        } catch (e) {
            console.error('[useProfile] updateMatchingPreferences error:', e);
            throw e;
        }
    }, [updateMatchingPrefsMutation]);

    const updatePrivacy = useCallback(async (payload: Record<string, unknown>) => {
        try {
            return await updatePrivacyMutation({ privacySettingsUpdate: payload } as any).unwrap();
        } catch (e) {
            console.error('[useProfile] updatePrivacy error:', e);
            throw e;
        }
    }, [updatePrivacyMutation]);

    const updateNotifications = useCallback(async (payload: Record<string, unknown>) => {
        try {
            return await updateNotifMutation({ notificationSettingsUpdate: payload } as any).unwrap();
        } catch (e) {
            console.error('[useProfile] updateNotifications error:', e);
            throw e;
        }
    }, [updateNotifMutation]);

    const addInterest = useCallback(async (category: string, interest: string) => {
        try {
            return await addInterestMutation({ category, interest }).unwrap();
        } catch (e) {
            console.error('[useProfile] addInterest error:', e);
            throw e;
        }
    }, [addInterestMutation]);

    const removeInterest = useCallback(async (category: string, interest: string) => {
        try {
            return await removeInterestMutation({ category, interest }).unwrap();
        } catch (e) {
            console.error('[useProfile] removeInterest error:', e);
            throw e;
        }
    }, [removeInterestMutation]);

    return {
        // Data
        user,
        profile,
        authUser,
        preferences,
        matchingPreferences,
        privacySettings,
        notifSettings,
        stats,
        interests,
        recentActivity,

        // Loading states
        isLoading: isAuthLoading || isProfileLoading,
        isUpdatingProfile,

        // Actions
        refetchProfile,
        updateProfile,
        updatePreferences,
        updateMatchingPreferences,
        updatePrivacy,
        updateNotifications,
        addInterest,
        removeInterest,
    };
};
