import { api } from "./apibase";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    publicRecommendationsRootV1RecommendationsPublicGet: build.query<
      PublicRecommendationsRootV1RecommendationsPublicGetApiResponse,
      PublicRecommendationsRootV1RecommendationsPublicGetApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/recommendations/public/`,
        params: {
          genre: queryArg.genre,
          limit: queryArg.limit,
        },
      }),
    }),
    publicRecommendationsEndpointV1RecommendationsPublicRecommendationsGet:
      build.query<
        PublicRecommendationsEndpointV1RecommendationsPublicRecommendationsGetApiResponse,
        PublicRecommendationsEndpointV1RecommendationsPublicRecommendationsGetApiArg
      >({
        query: (queryArg) => ({
          url: `/v1/recommendations/public/recommendations`,
          params: {
            genre: queryArg.genre,
            limit: queryArg.limit,
          },
        }),
      }),
    getPersonalizedRecommendationsV1RecommendationsPublicPersonalizedGet:
      build.query<
        GetPersonalizedRecommendationsV1RecommendationsPublicPersonalizedGetApiResponse,
        GetPersonalizedRecommendationsV1RecommendationsPublicPersonalizedGetApiArg
      >({
        query: (queryArg) => ({
          url: `/v1/recommendations/public/personalized`,
          params: {
            limit: queryArg.limit,
          },
        }),
      }),
    registerV1AuthRegisterPost: build.mutation<
      RegisterV1AuthRegisterPostApiResponse,
      RegisterV1AuthRegisterPostApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/auth/register`,
        method: "POST",
        body: queryArg.userRegister,
      }),
    }),
    loginForAccessTokenV1AuthLoginPost: build.mutation<
      LoginForAccessTokenV1AuthLoginPostApiResponse,
      LoginForAccessTokenV1AuthLoginPostApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/auth/login`,
        method: "POST",
        body: queryArg.bodyLoginForAccessTokenV1AuthLoginPost,
      }),
    }),
    loginJsonV1AuthLoginJsonPost: build.mutation<
      LoginJsonV1AuthLoginJsonPostApiResponse,
      LoginJsonV1AuthLoginJsonPostApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/auth/login/json`,
        method: "POST",
        body: queryArg.userLogin,
      }),
    }),
    refreshTokenV1AuthRefreshPost: build.mutation<
      RefreshTokenV1AuthRefreshPostApiResponse,
      RefreshTokenV1AuthRefreshPostApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/auth/refresh`,
        method: "POST",
        body: queryArg.tokenRefresh,
      }),
    }),
    logoutV1AuthLogoutPost: build.mutation<
      LogoutV1AuthLogoutPostApiResponse,
      LogoutV1AuthLogoutPostApiArg
    >({
      query: () => ({ url: `/v1/auth/logout`, method: "POST" }),
    }),
    getCurrentUserInfoV1AuthMeGet: build.query<
      GetCurrentUserInfoV1AuthMeGetApiResponse,
      GetCurrentUserInfoV1AuthMeGetApiArg
    >({
      query: () => ({ url: `/v1/auth/me` }),
    }),
    changePasswordV1AuthChangePasswordPost: build.mutation<
      ChangePasswordV1AuthChangePasswordPostApiResponse,
      ChangePasswordV1AuthChangePasswordPostApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/auth/change-password`,
        method: "POST",
        params: {
          current_password: queryArg.currentPassword,
          new_password: queryArg.newPassword,
        },
      }),
    }),
    forgotPasswordV1AuthForgotPasswordPost: build.mutation<
      ForgotPasswordV1AuthForgotPasswordPostApiResponse,
      ForgotPasswordV1AuthForgotPasswordPostApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/auth/forgot-password`,
        method: "POST",
        body: queryArg.passwordReset,
      }),
    }),
    resetPasswordV1AuthResetPasswordPost: build.mutation<
      ResetPasswordV1AuthResetPasswordPostApiResponse,
      ResetPasswordV1AuthResetPasswordPostApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/auth/reset-password`,
        method: "POST",
        body: queryArg.passwordResetConfirm,
      }),
    }),
    getMyProfileV1UsersProfileGet: build.query<
      GetMyProfileV1UsersProfileGetApiResponse,
      GetMyProfileV1UsersProfileGetApiArg
    >({
      query: () => ({ url: `/v1/users/profile` }),
    }),
    updateUserProfileV1UsersProfilePut: build.mutation<
      UpdateUserProfileV1UsersProfilePutApiResponse,
      UpdateUserProfileV1UsersProfilePutApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/users/profile`,
        method: "PUT",
        body: queryArg.userProfileUpdate,
      }),
    }),
    updateUserProfileV1UsersProfilePost: build.mutation<
      UpdateUserProfileV1UsersProfilePostApiResponse,
      UpdateUserProfileV1UsersProfilePostApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/users/profile`,
        method: "POST",
        body: queryArg.userProfileUpdate,
      }),
    }),
    getUserProfileByIdV1UsersProfileUserIdGet: build.query<
      GetUserProfileByIdV1UsersProfileUserIdGetApiResponse,
      GetUserProfileByIdV1UsersProfileUserIdGetApiArg
    >({
      query: (queryArg) => ({ url: `/v1/users/profile/${queryArg.userId}` }),
    }),
    getUserPreferencesV1UsersPreferencesGet: build.query<
      GetUserPreferencesV1UsersPreferencesGetApiResponse,
      GetUserPreferencesV1UsersPreferencesGetApiArg
    >({
      query: () => ({ url: `/v1/users/preferences` }),
    }),
    updateUserPreferencesV1UsersPreferencesPut: build.mutation<
      UpdateUserPreferencesV1UsersPreferencesPutApiResponse,
      UpdateUserPreferencesV1UsersPreferencesPutApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/users/preferences`,
        method: "PUT",
        body: queryArg.userPreferences,
      }),
    }),
    getMatchingPreferencesV1UsersMatchingPreferencesGet: build.query<
      GetMatchingPreferencesV1UsersMatchingPreferencesGetApiResponse,
      GetMatchingPreferencesV1UsersMatchingPreferencesGetApiArg
    >({
      query: () => ({ url: `/v1/users/matching/preferences` }),
    }),
    updateMatchingPreferencesV1UsersMatchingPreferencesPut: build.mutation<
      UpdateMatchingPreferencesV1UsersMatchingPreferencesPutApiResponse,
      UpdateMatchingPreferencesV1UsersMatchingPreferencesPutApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/users/matching/preferences`,
        method: "PUT",
        body: queryArg.matchingPreferences,
      }),
    }),
    getPrivacySettingsV1UsersSettingsPrivacyGet: build.query<
      GetPrivacySettingsV1UsersSettingsPrivacyGetApiResponse,
      GetPrivacySettingsV1UsersSettingsPrivacyGetApiArg
    >({
      query: () => ({ url: `/v1/users/settings/privacy` }),
    }),
    updatePrivacySettingsV1UsersSettingsPrivacyPut: build.mutation<
      UpdatePrivacySettingsV1UsersSettingsPrivacyPutApiResponse,
      UpdatePrivacySettingsV1UsersSettingsPrivacyPutApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/users/settings/privacy`,
        method: "PUT",
        body: queryArg.privacySettings,
      }),
    }),
    getNotificationSettingsV1UsersSettingsNotificationsGet: build.query<
      GetNotificationSettingsV1UsersSettingsNotificationsGetApiResponse,
      GetNotificationSettingsV1UsersSettingsNotificationsGetApiArg
    >({
      query: () => ({ url: `/v1/users/settings/notifications` }),
    }),
    updateNotificationSettingsV1UsersSettingsNotificationsPut: build.mutation<
      UpdateNotificationSettingsV1UsersSettingsNotificationsPutApiResponse,
      UpdateNotificationSettingsV1UsersSettingsNotificationsPutApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/users/settings/notifications`,
        method: "PUT",
        body: queryArg.notificationSettings,
      }),
    }),
    getAppSettingsV1UsersSettingsAppGet: build.query<
      GetAppSettingsV1UsersSettingsAppGetApiResponse,
      GetAppSettingsV1UsersSettingsAppGetApiArg
    >({
      query: () => ({ url: `/v1/users/settings/app` }),
    }),
    updateAppSettingsV1UsersSettingsAppPut: build.mutation<
      UpdateAppSettingsV1UsersSettingsAppPutApiResponse,
      UpdateAppSettingsV1UsersSettingsAppPutApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/users/settings/app`,
        method: "PUT",
        body: queryArg.appSettings,
      }),
    }),
    getUserStatsV1UsersStatsGet: build.query<
      GetUserStatsV1UsersStatsGetApiResponse,
      GetUserStatsV1UsersStatsGetApiArg
    >({
      query: () => ({ url: `/v1/users/stats` }),
    }),
    getRecentActivityV1UsersActivityRecentGet: build.query<
      GetRecentActivityV1UsersActivityRecentGetApiResponse,
      GetRecentActivityV1UsersActivityRecentGetApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/users/activity/recent`,
        params: {
          limit: queryArg.limit,
        },
      }),
    }),
    getPotentialMatchesV1MatchingDiscoverGet: build.query<
      GetPotentialMatchesV1MatchingDiscoverGetApiResponse,
      GetPotentialMatchesV1MatchingDiscoverGetApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/matching/discover`,
        params: {
          limit: queryArg.limit,
        },
      }),
    }),
    swipeUserV1MatchingSwipePost: build.mutation<
      SwipeUserV1MatchingSwipePostApiResponse,
      SwipeUserV1MatchingSwipePostApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/matching/swipe`,
        method: "POST",
        body: queryArg.swipeRequest,
      }),
    }),
    getMatchesV1MatchingMatchesGet: build.query<
      GetMatchesV1MatchingMatchesGetApiResponse,
      GetMatchesV1MatchingMatchesGetApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/matching/matches`,
        params: {
          limit: queryArg.limit,
        },
      }),
    }),
    getMatchDetailsV1MatchingMatchesMatchIdGet: build.query<
      GetMatchDetailsV1MatchingMatchesMatchIdGetApiResponse,
      GetMatchDetailsV1MatchingMatchesMatchIdGetApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/matching/matches/${queryArg.matchId}`,
      }),
    }),
    unmatchUserV1MatchingMatchesMatchIdDelete: build.mutation<
      UnmatchUserV1MatchingMatchesMatchIdDeleteApiResponse,
      UnmatchUserV1MatchingMatchesMatchIdDeleteApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/matching/matches/${queryArg.matchId}`,
        method: "DELETE",
      }),
    }),
    getConnectionsV1MatchingConnectionsGet: build.query<
      GetConnectionsV1MatchingConnectionsGetApiResponse,
      GetConnectionsV1MatchingConnectionsGetApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/matching/connections`,
        params: {
          limit: queryArg.limit,
        },
      }),
    }),
    addConnectionV1MatchingConnectionsUserIdPost: build.mutation<
      AddConnectionV1MatchingConnectionsUserIdPostApiResponse,
      AddConnectionV1MatchingConnectionsUserIdPostApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/matching/connections/${queryArg.userId}`,
        method: "POST",
      }),
    }),
    removeConnectionV1MatchingConnectionsUserIdDelete: build.mutation<
      RemoveConnectionV1MatchingConnectionsUserIdDeleteApiResponse,
      RemoveConnectionV1MatchingConnectionsUserIdDeleteApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/matching/connections/${queryArg.userId}`,
        method: "DELETE",
      }),
    }),
    getCompatibilityWithUserV1MatchingCompatibilityUserIdGet: build.query<
      GetCompatibilityWithUserV1MatchingCompatibilityUserIdGetApiResponse,
      GetCompatibilityWithUserV1MatchingCompatibilityUserIdGetApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/matching/compatibility/${queryArg.userId}`,
      }),
    }),
    getMatchingStatsV1MatchingStatsGet: build.query<
      GetMatchingStatsV1MatchingStatsGetApiResponse,
      GetMatchingStatsV1MatchingStatsGetApiArg
    >({
      query: () => ({ url: `/v1/matching/stats` }),
    }),
    getConversationsV1ChatConversationsGet: build.query<
      GetConversationsV1ChatConversationsGetApiResponse,
      GetConversationsV1ChatConversationsGetApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/chat/conversations`,
        params: {
          limit: queryArg.limit,
          status: queryArg.status,
        },
      }),
    }),
    createConversationV1ChatConversationsPost: build.mutation<
      CreateConversationV1ChatConversationsPostApiResponse,
      CreateConversationV1ChatConversationsPostApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/chat/conversations`,
        method: "POST",
        body: queryArg.conversationCreate,
      }),
    }),
    getConversationDetailsV1ChatConversationsConversationIdGet: build.query<
      GetConversationDetailsV1ChatConversationsConversationIdGetApiResponse,
      GetConversationDetailsV1ChatConversationsConversationIdGetApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/chat/conversations/${queryArg.conversationId}`,
      }),
    }),
    deleteConversationV1ChatConversationsConversationIdDelete: build.mutation<
      DeleteConversationV1ChatConversationsConversationIdDeleteApiResponse,
      DeleteConversationV1ChatConversationsConversationIdDeleteApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/chat/conversations/${queryArg.conversationId}`,
        method: "DELETE",
      }),
    }),
    updateConversationStatusV1ChatConversationsConversationIdStatusPut:
      build.mutation<
        UpdateConversationStatusV1ChatConversationsConversationIdStatusPutApiResponse,
        UpdateConversationStatusV1ChatConversationsConversationIdStatusPutApiArg
      >({
        query: (queryArg) => ({
          url: `/v1/chat/conversations/${queryArg.conversationId}/status`,
          method: "PUT",
          params: {
            status: queryArg.status,
          },
        }),
      }),
    getMessagesV1ChatConversationsConversationIdMessagesGet: build.query<
      GetMessagesV1ChatConversationsConversationIdMessagesGetApiResponse,
      GetMessagesV1ChatConversationsConversationIdMessagesGetApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/chat/conversations/${queryArg.conversationId}/messages`,
        params: {
          limit: queryArg.limit,
        },
      }),
    }),
    sendMessageV1ChatMessagesPost: build.mutation<
      SendMessageV1ChatMessagesPostApiResponse,
      SendMessageV1ChatMessagesPostApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/chat/messages`,
        method: "POST",
        body: queryArg.messageSend,
      }),
    }),
    markMessageReadV1ChatMessagesMessageIdReadPut: build.mutation<
      MarkMessageReadV1ChatMessagesMessageIdReadPutApiResponse,
      MarkMessageReadV1ChatMessagesMessageIdReadPutApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/chat/messages/${queryArg.messageId}/read`,
        method: "PUT",
      }),
    }),
    markAllMessagesReadV1ChatConversationsConversationIdReadAllPut:
      build.mutation<
        MarkAllMessagesReadV1ChatConversationsConversationIdReadAllPutApiResponse,
        MarkAllMessagesReadV1ChatConversationsConversationIdReadAllPutApiArg
      >({
        query: (queryArg) => ({
          url: `/v1/chat/conversations/${queryArg.conversationId}/read-all`,
          method: "PUT",
        }),
      }),
    deleteMessageV1ChatMessagesMessageIdDelete: build.mutation<
      DeleteMessageV1ChatMessagesMessageIdDeleteApiResponse,
      DeleteMessageV1ChatMessagesMessageIdDeleteApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/chat/messages/${queryArg.messageId}`,
        method: "DELETE",
      }),
    }),
    sendTypingIndicatorV1ChatConversationsConversationIdTypingPost:
      build.mutation<
        SendTypingIndicatorV1ChatConversationsConversationIdTypingPostApiResponse,
        SendTypingIndicatorV1ChatConversationsConversationIdTypingPostApiArg
      >({
        query: (queryArg) => ({
          url: `/v1/chat/conversations/${queryArg.conversationId}/typing`,
          method: "POST",
          params: {
            is_typing: queryArg.isTyping,
          },
        }),
      }),
    shareTrackV1ChatShareTrackPost: build.mutation<
      ShareTrackV1ChatShareTrackPostApiResponse,
      ShareTrackV1ChatShareTrackPostApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/chat/share/track`,
        method: "POST",
        body: queryArg.shareContentRequest,
      }),
    }),
    sharePlaylistV1ChatSharePlaylistPost: build.mutation<
      SharePlaylistV1ChatSharePlaylistPostApiResponse,
      SharePlaylistV1ChatSharePlaylistPostApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/chat/share/playlist`,
        method: "POST",
        body: queryArg.shareContentRequest,
      }),
    }),
    shareMovieV1ChatShareMoviePost: build.mutation<
      ShareMovieV1ChatShareMoviePostApiResponse,
      ShareMovieV1ChatShareMoviePostApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/chat/share/movie`,
        method: "POST",
        body: queryArg.shareContentRequest,
      }),
    }),
    shareAnimeV1ChatShareAnimePost: build.mutation<
      ShareAnimeV1ChatShareAnimePostApiResponse,
      ShareAnimeV1ChatShareAnimePostApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/chat/share/anime`,
        method: "POST",
        body: queryArg.shareContentRequest,
      }),
    }),
    getChatStatsV1ChatStatsGet: build.query<
      GetChatStatsV1ChatStatsGetApiResponse,
      GetChatStatsV1ChatStatsGetApiArg
    >({
      query: () => ({ url: `/v1/chat/stats` }),
    }),
    getAllStoriesV1StoriesGet: build.query<
      GetAllStoriesV1StoriesGetApiResponse,
      GetAllStoriesV1StoriesGetApiArg
    >({
      query: () => ({ url: `/v1/stories/` }),
    }),
    createStoryV1StoriesPost: build.mutation<
      CreateStoryV1StoriesPostApiResponse,
      CreateStoryV1StoriesPostApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/stories/`,
        method: "POST",
        body: queryArg.storyCreate,
      }),
    }),
    getStoryDetailsV1StoriesStoryIdGet: build.query<
      GetStoryDetailsV1StoriesStoryIdGetApiResponse,
      GetStoryDetailsV1StoriesStoryIdGetApiArg
    >({
      query: (queryArg) => ({ url: `/v1/stories/${queryArg.storyId}` }),
    }),
    deleteStoryV1StoriesStoryIdDelete: build.mutation<
      DeleteStoryV1StoriesStoryIdDeleteApiResponse,
      DeleteStoryV1StoriesStoryIdDeleteApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/stories/${queryArg.storyId}`,
        method: "DELETE",
      }),
    }),
    getAllEventsV1EventsGet: build.query<
      GetAllEventsV1EventsGetApiResponse,
      GetAllEventsV1EventsGetApiArg
    >({
      query: () => ({ url: `/v1/events/` }),
    }),
    createEventV1EventsPost: build.mutation<
      CreateEventV1EventsPostApiResponse,
      CreateEventV1EventsPostApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/events/`,
        method: "POST",
        body: queryArg.eventCreate,
      }),
    }),
    getEventDetailsV1EventsEventIdGet: build.query<
      GetEventDetailsV1EventsEventIdGetApiResponse,
      GetEventDetailsV1EventsEventIdGetApiArg
    >({
      query: (queryArg) => ({ url: `/v1/events/${queryArg.eventId}` }),
    }),
    updateEventV1EventsEventIdPut: build.mutation<
      UpdateEventV1EventsEventIdPutApiResponse,
      UpdateEventV1EventsEventIdPutApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/events/${queryArg.eventId}`,
        method: "PUT",
        body: queryArg.eventCreate,
      }),
    }),
    deleteEventV1EventsEventIdDelete: build.mutation<
      DeleteEventV1EventsEventIdDeleteApiResponse,
      DeleteEventV1EventsEventIdDeleteApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/events/${queryArg.eventId}`,
        method: "DELETE",
      }),
    }),
    searchContentV1SearchGet: build.query<
      SearchContentV1SearchGetApiResponse,
      SearchContentV1SearchGetApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/search/`,
        params: {
          q: queryArg.q,
          limit: queryArg.limit,
        },
      }),
    }),
    getSearchSuggestionsV1SearchSuggestionsGet: build.query<
      GetSearchSuggestionsV1SearchSuggestionsGetApiResponse,
      GetSearchSuggestionsV1SearchSuggestionsGetApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/search/suggestions`,
        params: {
          q: queryArg.q,
          limit: queryArg.limit,
        },
      }),
    }),
    getRecentSearchesV1SearchRecentGet: build.query<
      GetRecentSearchesV1SearchRecentGetApiResponse,
      GetRecentSearchesV1SearchRecentGetApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/search/recent`,
        params: {
          limit: queryArg.limit,
        },
      }),
    }),
    getTrendingSearchesV1SearchTrendingGet: build.query<
      GetTrendingSearchesV1SearchTrendingGetApiResponse,
      GetTrendingSearchesV1SearchTrendingGetApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/search/trending`,
        params: {
          limit: queryArg.limit,
        },
      }),
    }),
    publicDiscoverRootV1DiscoverPublicGet: build.query<
      PublicDiscoverRootV1DiscoverPublicGetApiResponse,
      PublicDiscoverRootV1DiscoverPublicGetApiArg
    >({
      query: () => ({ url: `/v1/discover/public/` }),
    }),
    publicTrendingV1DiscoverPublicTrendingGet: build.query<
      PublicTrendingV1DiscoverPublicTrendingGetApiResponse,
      PublicTrendingV1DiscoverPublicTrendingGetApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/discover/public/trending`,
        params: {
          content_type: queryArg.contentType,
          limit: queryArg.limit,
        },
      }),
    }),
    publicGenresV1DiscoverPublicGenresGet: build.query<
      PublicGenresV1DiscoverPublicGenresGetApiResponse,
      PublicGenresV1DiscoverPublicGenresGetApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/discover/public/genres`,
        params: {
          category: queryArg.category,
        },
      }),
    }),
    getLibrarySummaryV1LibraryGet: build.query<
      GetLibrarySummaryV1LibraryGetApiResponse,
      GetLibrarySummaryV1LibraryGetApiArg
    >({
      query: () => ({ url: `/v1/library/` }),
    }),
    getLibraryTracksV1LibraryTracksGet: build.query<
      GetLibraryTracksV1LibraryTracksGetApiResponse,
      GetLibraryTracksV1LibraryTracksGetApiArg
    >({
      query: () => ({ url: `/v1/library/tracks` }),
    }),
    getLibraryAnimeV1LibraryAnimeGet: build.query<
      GetLibraryAnimeV1LibraryAnimeGetApiResponse,
      GetLibraryAnimeV1LibraryAnimeGetApiArg
    >({
      query: () => ({ url: `/v1/library/anime` }),
    }),
    getOrPostLibraryRecentV1LibraryRecentGet: build.query<
      GetOrPostLibraryRecentV1LibraryRecentGetApiResponse,
      GetOrPostLibraryRecentV1LibraryRecentGetApiArg
    >({
      query: () => ({ url: `/v1/library/recent` }),
    }),
    getOrPostLibraryRecentV1LibraryRecentPost: build.mutation<
      GetOrPostLibraryRecentV1LibraryRecentPostApiResponse,
      GetOrPostLibraryRecentV1LibraryRecentPostApiArg
    >({
      query: () => ({ url: `/v1/library/recent`, method: "POST" }),
    }),
    addTrackToLibraryV1LibraryTracksTrackIdPost: build.mutation<
      AddTrackToLibraryV1LibraryTracksTrackIdPostApiResponse,
      AddTrackToLibraryV1LibraryTracksTrackIdPostApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/library/tracks/${queryArg.trackId}`,
        method: "POST",
      }),
    }),
    removeTrackFromLibraryV1LibraryTracksTrackIdDelete: build.mutation<
      RemoveTrackFromLibraryV1LibraryTracksTrackIdDeleteApiResponse,
      RemoveTrackFromLibraryV1LibraryTracksTrackIdDeleteApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/library/tracks/${queryArg.trackId}`,
        method: "DELETE",
      }),
    }),
    getLibraryPlaylistsV1LibraryPlaylistsGet: build.query<
      GetLibraryPlaylistsV1LibraryPlaylistsGetApiResponse,
      GetLibraryPlaylistsV1LibraryPlaylistsGetApiArg
    >({
      query: () => ({ url: `/v1/library/playlists` }),
    }),
    createPlaylistV1LibraryPlaylistsPost: build.mutation<
      CreatePlaylistV1LibraryPlaylistsPostApiResponse,
      CreatePlaylistV1LibraryPlaylistsPostApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/library/playlists`,
        method: "POST",
        body: queryArg.playlistData,
      }),
    }),
    addTrackToPlaylistV1LibraryPlaylistsPlaylistIdTracksPost: build.mutation<
      AddTrackToPlaylistV1LibraryPlaylistsPlaylistIdTracksPostApiResponse,
      AddTrackToPlaylistV1LibraryPlaylistsPlaylistIdTracksPostApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/library/playlists/${queryArg.playlistId}/tracks`,
        method: "POST",
        body: queryArg.trackData,
      }),
    }),
    deletePlaylistV1LibraryPlaylistsPlaylistIdDelete: build.mutation<
      DeletePlaylistV1LibraryPlaylistsPlaylistIdDeleteApiResponse,
      DeletePlaylistV1LibraryPlaylistsPlaylistIdDeleteApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/library/playlists/${queryArg.playlistId}`,
        method: "DELETE",
      }),
    }),
    getMyPlaylistsV1PlaylistsPlaylistsMeGet: build.query<
      GetMyPlaylistsV1PlaylistsPlaylistsMeGetApiResponse,
      GetMyPlaylistsV1PlaylistsPlaylistsMeGetApiArg
    >({
      query: () => ({ url: `/v1/playlists/playlists/me` }),
    }),
    createPlaylistV1PlaylistsPlaylistsPost: build.mutation<
      CreatePlaylistV1PlaylistsPlaylistsPostApiResponse,
      CreatePlaylistV1PlaylistsPlaylistsPostApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/playlists/playlists`,
        method: "POST",
        body: queryArg.createPlaylistRequest,
      }),
    }),
    addTrackToPlaylistV1PlaylistsPlaylistsPlaylistIdTracksPost: build.mutation<
      AddTrackToPlaylistV1PlaylistsPlaylistsPlaylistIdTracksPostApiResponse,
      AddTrackToPlaylistV1PlaylistsPlaylistsPlaylistIdTracksPostApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/playlists/playlists/${queryArg.playlistId}/tracks`,
        method: "POST",
        body: queryArg.addTrackRequest,
      }),
    }),
    commonLikedTracksV1BudBudCommonLikedTracksPost: build.mutation<
      CommonLikedTracksV1BudBudCommonLikedTracksPostApiResponse,
      CommonLikedTracksV1BudBudCommonLikedTracksPostApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/bud/bud/common/liked/tracks`,
        method: "POST",
        body: queryArg.budRequest,
      }),
    }),
    commonLikedArtistsV1BudBudCommonLikedArtistsPost: build.mutation<
      CommonLikedArtistsV1BudBudCommonLikedArtistsPostApiResponse,
      CommonLikedArtistsV1BudBudCommonLikedArtistsPostApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/bud/bud/common/liked/artists`,
        method: "POST",
        body: queryArg.budRequest,
      }),
    }),
    commonLikedAlbumsV1BudBudCommonLikedAlbumsPost: build.mutation<
      CommonLikedAlbumsV1BudBudCommonLikedAlbumsPostApiResponse,
      CommonLikedAlbumsV1BudBudCommonLikedAlbumsPostApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/bud/bud/common/liked/albums`,
        method: "POST",
        body: queryArg.budRequest,
      }),
    }),
    commonPlayedTracksV1BudBudCommonPlayedTracksPost: build.mutation<
      CommonPlayedTracksV1BudBudCommonPlayedTracksPostApiResponse,
      CommonPlayedTracksV1BudBudCommonPlayedTracksPostApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/bud/bud/common/played/tracks`,
        method: "POST",
        body: queryArg.budRequest,
      }),
    }),
    commonTopArtistsV1BudBudCommonTopArtistsPost: build.mutation<
      CommonTopArtistsV1BudBudCommonTopArtistsPostApiResponse,
      CommonTopArtistsV1BudBudCommonTopArtistsPostApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/bud/bud/common/top/artists`,
        method: "POST",
        body: queryArg.budRequest,
      }),
    }),
    commonTopGenresV1BudBudCommonTopGenresPost: build.mutation<
      CommonTopGenresV1BudBudCommonTopGenresPostApiResponse,
      CommonTopGenresV1BudBudCommonTopGenresPostApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/bud/bud/common/top/genres`,
        method: "POST",
        body: queryArg.budRequest,
      }),
    }),
    commonTopAnimeV1BudBudCommonTopAnimePost: build.mutation<
      CommonTopAnimeV1BudBudCommonTopAnimePostApiResponse,
      CommonTopAnimeV1BudBudCommonTopAnimePostApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/bud/bud/common/top/anime`,
        method: "POST",
        body: queryArg.budRequest,
      }),
    }),
    commonTopMangaV1BudBudCommonTopMangaPost: build.mutation<
      CommonTopMangaV1BudBudCommonTopMangaPostApiResponse,
      CommonTopMangaV1BudBudCommonTopMangaPostApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/bud/bud/common/top/manga`,
        method: "POST",
        body: queryArg.budRequest,
      }),
    }),
    rootGet: build.query<RootGetApiResponse, RootGetApiArg>({
      query: () => ({ url: `/` }),
    }),
    healthCheckHealthGet: build.query<
      HealthCheckHealthGetApiResponse,
      HealthCheckHealthGetApiArg
    >({
      query: () => ({ url: `/health` }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as musicbudApi };
export type PublicRecommendationsRootV1RecommendationsPublicGetApiResponse =
  /** status 200 Successful Response */ any;
export type PublicRecommendationsRootV1RecommendationsPublicGetApiArg = {
  genre?: string | null;
  limit?: number;
};
export type PublicRecommendationsEndpointV1RecommendationsPublicRecommendationsGetApiResponse =
  /** status 200 Successful Response */ any;
export type PublicRecommendationsEndpointV1RecommendationsPublicRecommendationsGetApiArg =
  {
    genre?: string | null;
    limit?: number;
  };
export type GetPersonalizedRecommendationsV1RecommendationsPublicPersonalizedGetApiResponse =
  /** status 200 Successful Response */ any;
export type GetPersonalizedRecommendationsV1RecommendationsPublicPersonalizedGetApiArg =
  {
    limit?: number;
  };
export type RegisterV1AuthRegisterPostApiResponse =
  /** status 200 Successful Response */ UserResponse;
export type RegisterV1AuthRegisterPostApiArg = {
  userRegister: UserRegister;
};
export type LoginForAccessTokenV1AuthLoginPostApiResponse =
  /** status 200 Successful Response */ TokenResponse;
export type LoginForAccessTokenV1AuthLoginPostApiArg = {
  bodyLoginForAccessTokenV1AuthLoginPost: BodyLoginForAccessTokenV1AuthLoginPost;
};
export type LoginJsonV1AuthLoginJsonPostApiResponse =
  /** status 200 Successful Response */ TokenResponse;
export type LoginJsonV1AuthLoginJsonPostApiArg = {
  userLogin: UserLogin;
};
export type RefreshTokenV1AuthRefreshPostApiResponse =
  /** status 200 Successful Response */ TokenResponse;
export type RefreshTokenV1AuthRefreshPostApiArg = {
  tokenRefresh: TokenRefresh;
};
export type LogoutV1AuthLogoutPostApiResponse =
  /** status 200 Successful Response */ any;
export type LogoutV1AuthLogoutPostApiArg = void;
export type GetCurrentUserInfoV1AuthMeGetApiResponse =
  /** status 200 Successful Response */ UserResponse;
export type GetCurrentUserInfoV1AuthMeGetApiArg = void;
export type ChangePasswordV1AuthChangePasswordPostApiResponse =
  /** status 200 Successful Response */ any;
export type ChangePasswordV1AuthChangePasswordPostApiArg = {
  currentPassword: string;
  newPassword: string;
};
export type ForgotPasswordV1AuthForgotPasswordPostApiResponse =
  /** status 200 Successful Response */ any;
export type ForgotPasswordV1AuthForgotPasswordPostApiArg = {
  passwordReset: PasswordReset;
};
export type ResetPasswordV1AuthResetPasswordPostApiResponse =
  /** status 200 Successful Response */ any;
export type ResetPasswordV1AuthResetPasswordPostApiArg = {
  passwordResetConfirm: PasswordResetConfirm;
};
export type GetMyProfileV1UsersProfileGetApiResponse =
  /** status 200 Successful Response */ any;
export type GetMyProfileV1UsersProfileGetApiArg = void;
export type UpdateUserProfileV1UsersProfilePutApiResponse =
  /** status 200 Successful Response */ any;
export type UpdateUserProfileV1UsersProfilePutApiArg = {
  userProfileUpdate: UserProfileUpdate;
};
export type UpdateUserProfileV1UsersProfilePostApiResponse =
  /** status 200 Successful Response */ any;
export type UpdateUserProfileV1UsersProfilePostApiArg = {
  userProfileUpdate: UserProfileUpdate;
};
export type GetUserProfileByIdV1UsersProfileUserIdGetApiResponse =
  /** status 200 Successful Response */ any;
export type GetUserProfileByIdV1UsersProfileUserIdGetApiArg = {
  userId: string;
};
export type GetUserPreferencesV1UsersPreferencesGetApiResponse =
  /** status 200 Successful Response */ any;
export type GetUserPreferencesV1UsersPreferencesGetApiArg = void;
export type UpdateUserPreferencesV1UsersPreferencesPutApiResponse =
  /** status 200 Successful Response */ any;
export type UpdateUserPreferencesV1UsersPreferencesPutApiArg = {
  userPreferences: UserPreferences;
};
export type GetMatchingPreferencesV1UsersMatchingPreferencesGetApiResponse =
  /** status 200 Successful Response */ any;
export type GetMatchingPreferencesV1UsersMatchingPreferencesGetApiArg = void;
export type UpdateMatchingPreferencesV1UsersMatchingPreferencesPutApiResponse =
  /** status 200 Successful Response */ any;
export type UpdateMatchingPreferencesV1UsersMatchingPreferencesPutApiArg = {
  matchingPreferences: MatchingPreferences;
};
export type GetPrivacySettingsV1UsersSettingsPrivacyGetApiResponse =
  /** status 200 Successful Response */ any;
export type GetPrivacySettingsV1UsersSettingsPrivacyGetApiArg = void;
export type UpdatePrivacySettingsV1UsersSettingsPrivacyPutApiResponse =
  /** status 200 Successful Response */ any;
export type UpdatePrivacySettingsV1UsersSettingsPrivacyPutApiArg = {
  privacySettings: PrivacySettings;
};
export type GetNotificationSettingsV1UsersSettingsNotificationsGetApiResponse =
  /** status 200 Successful Response */ any;
export type GetNotificationSettingsV1UsersSettingsNotificationsGetApiArg = void;
export type UpdateNotificationSettingsV1UsersSettingsNotificationsPutApiResponse =
  /** status 200 Successful Response */ any;
export type UpdateNotificationSettingsV1UsersSettingsNotificationsPutApiArg = {
  notificationSettings: NotificationSettings;
};
export type GetAppSettingsV1UsersSettingsAppGetApiResponse =
  /** status 200 Successful Response */ any;
export type GetAppSettingsV1UsersSettingsAppGetApiArg = void;
export type UpdateAppSettingsV1UsersSettingsAppPutApiResponse =
  /** status 200 Successful Response */ any;
export type UpdateAppSettingsV1UsersSettingsAppPutApiArg = {
  appSettings: AppSettings;
};
export type GetUserStatsV1UsersStatsGetApiResponse =
  /** status 200 Successful Response */ any;
export type GetUserStatsV1UsersStatsGetApiArg = void;
export type GetRecentActivityV1UsersActivityRecentGetApiResponse =
  /** status 200 Successful Response */ any;
export type GetRecentActivityV1UsersActivityRecentGetApiArg = {
  limit?: number;
};
export type GetPotentialMatchesV1MatchingDiscoverGetApiResponse =
  /** status 200 Successful Response */ any;
export type GetPotentialMatchesV1MatchingDiscoverGetApiArg = {
  limit?: number;
};
export type SwipeUserV1MatchingSwipePostApiResponse =
  /** status 200 Successful Response */ any;
export type SwipeUserV1MatchingSwipePostApiArg = {
  swipeRequest: SwipeRequest;
};
export type GetMatchesV1MatchingMatchesGetApiResponse =
  /** status 200 Successful Response */ any;
export type GetMatchesV1MatchingMatchesGetApiArg = {
  limit?: number;
};
export type GetMatchDetailsV1MatchingMatchesMatchIdGetApiResponse =
  /** status 200 Successful Response */ any;
export type GetMatchDetailsV1MatchingMatchesMatchIdGetApiArg = {
  matchId: string;
};
export type UnmatchUserV1MatchingMatchesMatchIdDeleteApiResponse =
  /** status 200 Successful Response */ any;
export type UnmatchUserV1MatchingMatchesMatchIdDeleteApiArg = {
  matchId: string;
};
export type GetConnectionsV1MatchingConnectionsGetApiResponse =
  /** status 200 Successful Response */ any;
export type GetConnectionsV1MatchingConnectionsGetApiArg = {
  limit?: number;
};
export type AddConnectionV1MatchingConnectionsUserIdPostApiResponse =
  /** status 200 Successful Response */ any;
export type AddConnectionV1MatchingConnectionsUserIdPostApiArg = {
  userId: string;
};
export type RemoveConnectionV1MatchingConnectionsUserIdDeleteApiResponse =
  /** status 200 Successful Response */ any;
export type RemoveConnectionV1MatchingConnectionsUserIdDeleteApiArg = {
  userId: string;
};
export type GetCompatibilityWithUserV1MatchingCompatibilityUserIdGetApiResponse =
  /** status 200 Successful Response */ any;
export type GetCompatibilityWithUserV1MatchingCompatibilityUserIdGetApiArg = {
  userId: string;
};
export type GetMatchingStatsV1MatchingStatsGetApiResponse =
  /** status 200 Successful Response */ any;
export type GetMatchingStatsV1MatchingStatsGetApiArg = void;
export type GetConversationsV1ChatConversationsGetApiResponse =
  /** status 200 Successful Response */ any;
export type GetConversationsV1ChatConversationsGetApiArg = {
  limit?: number;
  status?: string | null;
};
export type CreateConversationV1ChatConversationsPostApiResponse =
  /** status 200 Successful Response */ any;
export type CreateConversationV1ChatConversationsPostApiArg = {
  conversationCreate: ConversationCreate;
};
export type GetConversationDetailsV1ChatConversationsConversationIdGetApiResponse =
  /** status 200 Successful Response */ any;
export type GetConversationDetailsV1ChatConversationsConversationIdGetApiArg = {
  conversationId: string;
};
export type DeleteConversationV1ChatConversationsConversationIdDeleteApiResponse =
  /** status 200 Successful Response */ any;
export type DeleteConversationV1ChatConversationsConversationIdDeleteApiArg = {
  conversationId: string;
};
export type UpdateConversationStatusV1ChatConversationsConversationIdStatusPutApiResponse =
  /** status 200 Successful Response */ any;
export type UpdateConversationStatusV1ChatConversationsConversationIdStatusPutApiArg =
  {
    conversationId: string;
    status: "active" | "archived" | "muted" | "blocked";
  };
export type GetMessagesV1ChatConversationsConversationIdMessagesGetApiResponse =
  /** status 200 Successful Response */ any;
export type GetMessagesV1ChatConversationsConversationIdMessagesGetApiArg = {
  conversationId: string;
  limit?: number;
};
export type SendMessageV1ChatMessagesPostApiResponse =
  /** status 200 Successful Response */ any;
export type SendMessageV1ChatMessagesPostApiArg = {
  messageSend: MessageSend;
};
export type MarkMessageReadV1ChatMessagesMessageIdReadPutApiResponse =
  /** status 200 Successful Response */ any;
export type MarkMessageReadV1ChatMessagesMessageIdReadPutApiArg = {
  messageId: string;
};
export type MarkAllMessagesReadV1ChatConversationsConversationIdReadAllPutApiResponse =
  /** status 200 Successful Response */ any;
export type MarkAllMessagesReadV1ChatConversationsConversationIdReadAllPutApiArg =
  {
    conversationId: string;
  };
export type DeleteMessageV1ChatMessagesMessageIdDeleteApiResponse =
  /** status 200 Successful Response */ any;
export type DeleteMessageV1ChatMessagesMessageIdDeleteApiArg = {
  messageId: string;
};
export type SendTypingIndicatorV1ChatConversationsConversationIdTypingPostApiResponse =
  /** status 200 Successful Response */ any;
export type SendTypingIndicatorV1ChatConversationsConversationIdTypingPostApiArg =
  {
    conversationId: string;
    isTyping: boolean;
  };
export type ShareTrackV1ChatShareTrackPostApiResponse =
  /** status 200 Successful Response */ any;
export type ShareTrackV1ChatShareTrackPostApiArg = {
  shareContentRequest: ShareContentRequest;
};
export type SharePlaylistV1ChatSharePlaylistPostApiResponse =
  /** status 200 Successful Response */ any;
export type SharePlaylistV1ChatSharePlaylistPostApiArg = {
  shareContentRequest: ShareContentRequest;
};
export type ShareMovieV1ChatShareMoviePostApiResponse =
  /** status 200 Successful Response */ any;
export type ShareMovieV1ChatShareMoviePostApiArg = {
  shareContentRequest: ShareContentRequest;
};
export type ShareAnimeV1ChatShareAnimePostApiResponse =
  /** status 200 Successful Response */ any;
export type ShareAnimeV1ChatShareAnimePostApiArg = {
  shareContentRequest: ShareContentRequest;
};
export type GetChatStatsV1ChatStatsGetApiResponse =
  /** status 200 Successful Response */ any;
export type GetChatStatsV1ChatStatsGetApiArg = void;
export type GetAllStoriesV1StoriesGetApiResponse =
  /** status 200 Successful Response */ StoryListResponse;
export type GetAllStoriesV1StoriesGetApiArg = void;
export type CreateStoryV1StoriesPostApiResponse =
  /** status 200 Successful Response */ SingleStoryResponse;
export type CreateStoryV1StoriesPostApiArg = {
  storyCreate: StoryCreate;
};
export type GetStoryDetailsV1StoriesStoryIdGetApiResponse =
  /** status 200 Successful Response */ SingleStoryResponse;
export type GetStoryDetailsV1StoriesStoryIdGetApiArg = {
  storyId: string;
};
export type DeleteStoryV1StoriesStoryIdDeleteApiResponse =
  /** status 200 Successful Response */ any;
export type DeleteStoryV1StoriesStoryIdDeleteApiArg = {
  storyId: string;
};
export type GetAllEventsV1EventsGetApiResponse =
  /** status 200 Successful Response */ EventListResponse;
export type GetAllEventsV1EventsGetApiArg = void;
export type CreateEventV1EventsPostApiResponse =
  /** status 200 Successful Response */ SingleEventResponse;
export type CreateEventV1EventsPostApiArg = {
  eventCreate: EventCreate;
};
export type GetEventDetailsV1EventsEventIdGetApiResponse =
  /** status 200 Successful Response */ SingleEventResponse;
export type GetEventDetailsV1EventsEventIdGetApiArg = {
  eventId: string;
};
export type UpdateEventV1EventsEventIdPutApiResponse =
  /** status 200 Successful Response */ SingleEventResponse;
export type UpdateEventV1EventsEventIdPutApiArg = {
  eventId: string;
  eventCreate: EventCreate;
};
export type DeleteEventV1EventsEventIdDeleteApiResponse =
  /** status 200 Successful Response */ any;
export type DeleteEventV1EventsEventIdDeleteApiArg = {
  eventId: string;
};
export type SearchContentV1SearchGetApiResponse =
  /** status 200 Successful Response */ any;
export type SearchContentV1SearchGetApiArg = {
  /** Search query string */
  q?: string | null;
  limit?: number;
};
export type GetSearchSuggestionsV1SearchSuggestionsGetApiResponse =
  /** status 200 Successful Response */ any;
export type GetSearchSuggestionsV1SearchSuggestionsGetApiArg = {
  /** Query to suggest for */
  q: string;
  limit?: number;
};
export type GetRecentSearchesV1SearchRecentGetApiResponse =
  /** status 200 Successful Response */ any;
export type GetRecentSearchesV1SearchRecentGetApiArg = {
  limit?: number;
};
export type GetTrendingSearchesV1SearchTrendingGetApiResponse =
  /** status 200 Successful Response */ any;
export type GetTrendingSearchesV1SearchTrendingGetApiArg = {
  limit?: number;
};
export type PublicDiscoverRootV1DiscoverPublicGetApiResponse =
  /** status 200 Successful Response */ any;
export type PublicDiscoverRootV1DiscoverPublicGetApiArg = void;
export type PublicTrendingV1DiscoverPublicTrendingGetApiResponse =
  /** status 200 Successful Response */ any;
export type PublicTrendingV1DiscoverPublicTrendingGetApiArg = {
  contentType?: string | null;
  limit?: number;
};
export type PublicGenresV1DiscoverPublicGenresGetApiResponse =
  /** status 200 Successful Response */ any;
export type PublicGenresV1DiscoverPublicGenresGetApiArg = {
  category?: string | null;
};
export type GetLibrarySummaryV1LibraryGetApiResponse =
  /** status 200 Successful Response */ any;
export type GetLibrarySummaryV1LibraryGetApiArg = void;
export type GetLibraryTracksV1LibraryTracksGetApiResponse =
  /** status 200 Successful Response */ any;
export type GetLibraryTracksV1LibraryTracksGetApiArg = void;
export type GetLibraryAnimeV1LibraryAnimeGetApiResponse =
  /** status 200 Successful Response */ any;
export type GetLibraryAnimeV1LibraryAnimeGetApiArg = void;
export type GetOrPostLibraryRecentV1LibraryRecentGetApiResponse =
  /** status 200 Successful Response */ any;
export type GetOrPostLibraryRecentV1LibraryRecentGetApiArg = void;
export type GetOrPostLibraryRecentV1LibraryRecentPostApiResponse =
  /** status 200 Successful Response */ any;
export type GetOrPostLibraryRecentV1LibraryRecentPostApiArg = void;
export type AddTrackToLibraryV1LibraryTracksTrackIdPostApiResponse =
  /** status 200 Successful Response */ any;
export type AddTrackToLibraryV1LibraryTracksTrackIdPostApiArg = {
  trackId: string;
};
export type RemoveTrackFromLibraryV1LibraryTracksTrackIdDeleteApiResponse =
  /** status 200 Successful Response */ any;
export type RemoveTrackFromLibraryV1LibraryTracksTrackIdDeleteApiArg = {
  trackId: string;
};
export type GetLibraryPlaylistsV1LibraryPlaylistsGetApiResponse =
  /** status 200 Successful Response */ any;
export type GetLibraryPlaylistsV1LibraryPlaylistsGetApiArg = void;
export type CreatePlaylistV1LibraryPlaylistsPostApiResponse =
  /** status 200 Successful Response */ any;
export type CreatePlaylistV1LibraryPlaylistsPostApiArg = {
  playlistData: {
    [key: string]: any;
  };
};
export type AddTrackToPlaylistV1LibraryPlaylistsPlaylistIdTracksPostApiResponse =
  /** status 200 Successful Response */ any;
export type AddTrackToPlaylistV1LibraryPlaylistsPlaylistIdTracksPostApiArg = {
  playlistId: string;
  trackData: {
    [key: string]: any;
  };
};
export type DeletePlaylistV1LibraryPlaylistsPlaylistIdDeleteApiResponse =
  /** status 200 Successful Response */ any;
export type DeletePlaylistV1LibraryPlaylistsPlaylistIdDeleteApiArg = {
  playlistId: string;
};
export type GetMyPlaylistsV1PlaylistsPlaylistsMeGetApiResponse =
  /** status 200 Successful Response */ any;
export type GetMyPlaylistsV1PlaylistsPlaylistsMeGetApiArg = void;
export type CreatePlaylistV1PlaylistsPlaylistsPostApiResponse =
  /** status 200 Successful Response */ any;
export type CreatePlaylistV1PlaylistsPlaylistsPostApiArg = {
  createPlaylistRequest: CreatePlaylistRequest;
};
export type AddTrackToPlaylistV1PlaylistsPlaylistsPlaylistIdTracksPostApiResponse =
  /** status 200 Successful Response */ any;
export type AddTrackToPlaylistV1PlaylistsPlaylistsPlaylistIdTracksPostApiArg = {
  playlistId: string;
  addTrackRequest: AddTrackRequest;
};
export type CommonLikedTracksV1BudBudCommonLikedTracksPostApiResponse =
  /** status 200 Successful Response */ any;
export type CommonLikedTracksV1BudBudCommonLikedTracksPostApiArg = {
  budRequest: BudRequest;
};
export type CommonLikedArtistsV1BudBudCommonLikedArtistsPostApiResponse =
  /** status 200 Successful Response */ any;
export type CommonLikedArtistsV1BudBudCommonLikedArtistsPostApiArg = {
  budRequest: BudRequest;
};
export type CommonLikedAlbumsV1BudBudCommonLikedAlbumsPostApiResponse =
  /** status 200 Successful Response */ any;
export type CommonLikedAlbumsV1BudBudCommonLikedAlbumsPostApiArg = {
  budRequest: BudRequest;
};
export type CommonPlayedTracksV1BudBudCommonPlayedTracksPostApiResponse =
  /** status 200 Successful Response */ any;
export type CommonPlayedTracksV1BudBudCommonPlayedTracksPostApiArg = {
  budRequest: BudRequest;
};
export type CommonTopArtistsV1BudBudCommonTopArtistsPostApiResponse =
  /** status 200 Successful Response */ any;
export type CommonTopArtistsV1BudBudCommonTopArtistsPostApiArg = {
  budRequest: BudRequest;
};
export type CommonTopGenresV1BudBudCommonTopGenresPostApiResponse =
  /** status 200 Successful Response */ any;
export type CommonTopGenresV1BudBudCommonTopGenresPostApiArg = {
  budRequest: BudRequest;
};
export type CommonTopAnimeV1BudBudCommonTopAnimePostApiResponse =
  /** status 200 Successful Response */ any;
export type CommonTopAnimeV1BudBudCommonTopAnimePostApiArg = {
  budRequest: BudRequest;
};
export type CommonTopMangaV1BudBudCommonTopMangaPostApiResponse =
  /** status 200 Successful Response */ any;
export type CommonTopMangaV1BudBudCommonTopMangaPostApiArg = {
  budRequest: BudRequest;
};
export type RootGetApiResponse = /** status 200 Successful Response */ any;
export type RootGetApiArg = void;
export type HealthCheckHealthGetApiResponse =
  /** status 200 Successful Response */ any;
export type HealthCheckHealthGetApiArg = void;
export type ValidationError = {
  loc: (string | number)[];
  msg: string;
  type: string;
  input?: any;
  ctx?: object;
};
export type HttpValidationError = {
  detail?: ValidationError[];
};
export type UserResponse = {
  success: boolean;
  message: string;
  data: {
    [key: string]: any;
  };
};
export type UserRegister = {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name?: string | null;
  last_name?: string | null;
};
export type TokenResponse = {
  success: boolean;
  message: string;
  data: {
    [key: string]: any;
  };
};
export type BodyLoginForAccessTokenV1AuthLoginPost = {
  grant_type?: string | null;
  username: string;
  password: string;
  scope?: string;
  client_id?: string | null;
  client_secret?: string | null;
};
export type UserLogin = {
  username: string;
  password: string;
  remember_me?: boolean | null;
};
export type TokenRefresh = {
  refresh_token: string;
};
export type PasswordReset = {
  email: string;
};
export type PasswordResetConfirm = {
  token: string;
  new_password: string;
  new_password_confirm: string;
};
export type UserProfileUpdate = {
  display_name?: string | null;
  bio?: string | null;
  location?: string | null;
  avatar_url?: string | null;
};
export type UserPreferences = {
  music_genres?: string[] | null;
  movie_genres?: string[] | null;
  anime_genres?: string[] | null;
  favorite_artists?: string[] | null;
  favorite_movies?: string[] | null;
  favorite_anime?: string[] | null;
};
export type MatchingPreferences = {
  age_range?: {
    [key: string]: number;
  } | null;
  distance_range?: number | null;
  gender_preference?: string | null;
  looking_for?: string[] | null;
  match_by_music?: boolean | null;
  match_by_movies?: boolean | null;
  match_by_anime?: boolean | null;
  min_compatibility?: number | null;
};
export type PrivacySettings = {
  profile_visibility?: string | null;
  show_age?: boolean | null;
  show_location?: boolean | null;
  show_last_seen?: boolean | null;
  allow_messages_from?: string | null;
  show_listening_activity?: boolean | null;
};
export type NotificationSettings = {
  push_enabled?: boolean | null;
  email_enabled?: boolean | null;
  new_matches?: boolean | null;
  new_messages?: boolean | null;
  friend_requests?: boolean | null;
  recommendations?: boolean | null;
  trending_updates?: boolean | null;
};
export type AppSettings = {
  theme?: string | null;
  language?: string | null;
  auto_play?: boolean | null;
  data_saver?: boolean | null;
  download_quality?: string | null;
};
export type SwipeRequest = {
  user_id: string;
  action: string;
};
export type ConversationCreate = {
  user_ids: string[];
  initial_message?: string | null;
};
export type MessageSend = {
  conversation_id: string;
  message_type?: string;
  content: string;
  metadata?: {
    [key: string]: any;
  } | null;
};
export type ShareContentRequest = {
  conversation_id: string;
  content_id: string;
  content_type: string;
  message?: string | null;
};
export type StoryInDb = {
  user_id: string;
  media_url: string;
  media_type: string;
  caption?: string | null;
  duration_seconds?: number | null;
  id: string;
  created_at: string;
  expires_at: string;
};
export type StoryListResponse = {
  success: boolean;
  message: string;
  data: StoryInDb[];
};
export type SingleStoryResponse = {
  success: boolean;
  message: string;
  data: StoryInDb;
};
export type StoryCreate = {
  user_id: string;
  media_url: string;
  media_type: string;
  caption?: string | null;
  duration_seconds?: number | null;
};
export type Attendee = {
  id: string;
  name: string;
  avatar_url?: string | null;
};
export type EventInDb = {
  title: string;
  description: string;
  date: string;
  location: string;
  cover_image_url?: string | null;
  id: string;
  organizer_id: string;
  attendees?: Attendee[];
  created_at: string;
  updated_at: string;
};
export type EventListResponse = {
  success: boolean;
  message: string;
  data: EventInDb[];
};
export type SingleEventResponse = {
  success: boolean;
  message: string;
  data: EventInDb;
};
export type EventCreate = {
  title: string;
  description: string;
  date: string;
  location: string;
  cover_image_url?: string | null;
};
export type CreatePlaylistRequest = {
  name: string;
  description?: string | null;
  cover_url?: string | null;
};
export type AddTrackRequest = {
  track_id: string;
};
export type BudRequest = {
  bud_id?: string | null;
  username?: string | null;
  budUid?: string | null;
  identifier?: string | null;
  page?: number | null;
};
export const {
  usePublicRecommendationsRootV1RecommendationsPublicGetQuery,
  usePublicRecommendationsEndpointV1RecommendationsPublicRecommendationsGetQuery,
  useGetPersonalizedRecommendationsV1RecommendationsPublicPersonalizedGetQuery,
  useRegisterV1AuthRegisterPostMutation,
  useLoginForAccessTokenV1AuthLoginPostMutation,
  useLoginJsonV1AuthLoginJsonPostMutation,
  useRefreshTokenV1AuthRefreshPostMutation,
  useLogoutV1AuthLogoutPostMutation,
  useGetCurrentUserInfoV1AuthMeGetQuery,
  useChangePasswordV1AuthChangePasswordPostMutation,
  useForgotPasswordV1AuthForgotPasswordPostMutation,
  useResetPasswordV1AuthResetPasswordPostMutation,
  useGetMyProfileV1UsersProfileGetQuery,
  useUpdateUserProfileV1UsersProfilePutMutation,
  useUpdateUserProfileV1UsersProfilePostMutation,
  useGetUserProfileByIdV1UsersProfileUserIdGetQuery,
  useGetUserPreferencesV1UsersPreferencesGetQuery,
  useUpdateUserPreferencesV1UsersPreferencesPutMutation,
  useGetMatchingPreferencesV1UsersMatchingPreferencesGetQuery,
  useUpdateMatchingPreferencesV1UsersMatchingPreferencesPutMutation,
  useGetPrivacySettingsV1UsersSettingsPrivacyGetQuery,
  useUpdatePrivacySettingsV1UsersSettingsPrivacyPutMutation,
  useGetNotificationSettingsV1UsersSettingsNotificationsGetQuery,
  useUpdateNotificationSettingsV1UsersSettingsNotificationsPutMutation,
  useGetAppSettingsV1UsersSettingsAppGetQuery,
  useUpdateAppSettingsV1UsersSettingsAppPutMutation,
  useGetUserStatsV1UsersStatsGetQuery,
  useGetRecentActivityV1UsersActivityRecentGetQuery,
  useGetPotentialMatchesV1MatchingDiscoverGetQuery,
  useSwipeUserV1MatchingSwipePostMutation,
  useGetMatchesV1MatchingMatchesGetQuery,
  useGetMatchDetailsV1MatchingMatchesMatchIdGetQuery,
  useUnmatchUserV1MatchingMatchesMatchIdDeleteMutation,
  useGetConnectionsV1MatchingConnectionsGetQuery,
  useAddConnectionV1MatchingConnectionsUserIdPostMutation,
  useRemoveConnectionV1MatchingConnectionsUserIdDeleteMutation,
  useGetCompatibilityWithUserV1MatchingCompatibilityUserIdGetQuery,
  useGetMatchingStatsV1MatchingStatsGetQuery,
  useGetConversationsV1ChatConversationsGetQuery,
  useCreateConversationV1ChatConversationsPostMutation,
  useGetConversationDetailsV1ChatConversationsConversationIdGetQuery,
  useDeleteConversationV1ChatConversationsConversationIdDeleteMutation,
  useUpdateConversationStatusV1ChatConversationsConversationIdStatusPutMutation,
  useGetMessagesV1ChatConversationsConversationIdMessagesGetQuery,
  useSendMessageV1ChatMessagesPostMutation,
  useMarkMessageReadV1ChatMessagesMessageIdReadPutMutation,
  useMarkAllMessagesReadV1ChatConversationsConversationIdReadAllPutMutation,
  useDeleteMessageV1ChatMessagesMessageIdDeleteMutation,
  useSendTypingIndicatorV1ChatConversationsConversationIdTypingPostMutation,
  useShareTrackV1ChatShareTrackPostMutation,
  useSharePlaylistV1ChatSharePlaylistPostMutation,
  useShareMovieV1ChatShareMoviePostMutation,
  useShareAnimeV1ChatShareAnimePostMutation,
  useGetChatStatsV1ChatStatsGetQuery,
  useGetAllStoriesV1StoriesGetQuery,
  useCreateStoryV1StoriesPostMutation,
  useGetStoryDetailsV1StoriesStoryIdGetQuery,
  useDeleteStoryV1StoriesStoryIdDeleteMutation,
  useGetAllEventsV1EventsGetQuery,
  useCreateEventV1EventsPostMutation,
  useGetEventDetailsV1EventsEventIdGetQuery,
  useUpdateEventV1EventsEventIdPutMutation,
  useDeleteEventV1EventsEventIdDeleteMutation,
  useSearchContentV1SearchGetQuery,
  useGetSearchSuggestionsV1SearchSuggestionsGetQuery,
  useGetRecentSearchesV1SearchRecentGetQuery,
  useGetTrendingSearchesV1SearchTrendingGetQuery,
  usePublicDiscoverRootV1DiscoverPublicGetQuery,
  usePublicTrendingV1DiscoverPublicTrendingGetQuery,
  usePublicGenresV1DiscoverPublicGenresGetQuery,
  useGetLibrarySummaryV1LibraryGetQuery,
  useGetLibraryTracksV1LibraryTracksGetQuery,
  useGetLibraryAnimeV1LibraryAnimeGetQuery,
  useGetOrPostLibraryRecentV1LibraryRecentGetQuery,
  useGetOrPostLibraryRecentV1LibraryRecentPostMutation,
  useAddTrackToLibraryV1LibraryTracksTrackIdPostMutation,
  useRemoveTrackFromLibraryV1LibraryTracksTrackIdDeleteMutation,
  useGetLibraryPlaylistsV1LibraryPlaylistsGetQuery,
  useCreatePlaylistV1LibraryPlaylistsPostMutation,
  useAddTrackToPlaylistV1LibraryPlaylistsPlaylistIdTracksPostMutation,
  useDeletePlaylistV1LibraryPlaylistsPlaylistIdDeleteMutation,
  useGetMyPlaylistsV1PlaylistsPlaylistsMeGetQuery,
  useCreatePlaylistV1PlaylistsPlaylistsPostMutation,
  useAddTrackToPlaylistV1PlaylistsPlaylistsPlaylistIdTracksPostMutation,
  useCommonLikedTracksV1BudBudCommonLikedTracksPostMutation,
  useCommonLikedArtistsV1BudBudCommonLikedArtistsPostMutation,
  useCommonLikedAlbumsV1BudBudCommonLikedAlbumsPostMutation,
  useCommonPlayedTracksV1BudBudCommonPlayedTracksPostMutation,
  useCommonTopArtistsV1BudBudCommonTopArtistsPostMutation,
  useCommonTopGenresV1BudBudCommonTopGenresPostMutation,
  useCommonTopAnimeV1BudBudCommonTopAnimePostMutation,
  useCommonTopMangaV1BudBudCommonTopMangaPostMutation,
  useRootGetQuery,
  useHealthCheckHealthGetQuery,
} = injectedRtkApi;
