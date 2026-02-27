// musicbud-expo/src/store/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Type Definitions ---

export interface User {
  id: string;
  username: string;
  email: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  connections_count?: number;
  followers_count?: number;
  following_count?: number;
  compatibility_score?: number;
  common_interests?: string[];
}

export interface Track {
  id: string;
  name: string;
  artist: string;
  album?: string;
  cover_url?: string;
  duration?: number;
  preview_url?: string;
  audio_url?: string;
}

export interface Album {
  id: string;
  name: string;
  artist: string;
  cover_url?: string;
  release_date?: string;
  tracks?: Track[];
}

export interface Artist {
  id: string;
  name: string;
  image_url?: string;
  genres?: string[];
  bio?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  cover_url?: string;
  tracks?: Track[];
  owner?: User;
}

export interface DiscoverContentResponse {
  data: {
    trending_tracks: Track[];
    new_releases: Album[];
    featured_playlists: Playlist[];
  };
}

export interface TrendingContentResponse {
  data: {
    tracks: Track[];
    albums: Album[];
    artists: Artist[];
  };
}

export interface AuthResponse {
  data: {
    access_token: string;
    token_type: string;
    user: User;
  };
}

export interface GenericResponse {
  message: string;
  status: string;
}

export interface ChatChannel {
  id: string;
  name?: string;
  participants: User[];
  last_message?: {
    content: string;
    sender_id: string;
    created_at: string;
  };
  unread_count?: number;
  updated_at: string;
}


// --- API Definition ---

// Define a custom base query that includes token from AsyncStorage
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL, // Base URL for all endpoints
  prepareHeaders: async (headers, { getState }) => {
    // Attempt to retrieve the token from AsyncStorage
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQuery,
  tagTypes: ['Auth', 'User', 'Chat', 'Content', 'Events', 'Matching', 'Stories', 'Profile', 'Activity', 'Settings', 'Preferences', 'Connections', 'Playlists'], // Comprehensive tag types
  endpoints: (builder) => ({
    // --- Authentication Endpoints ---
    register: builder.mutation<AuthResponse, { username: string; email: string; password: string; password_confirm: string }>({
      query: (credentials) => ({
        url: 'auth/register',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    login: builder.mutation<AuthResponse, { username: string; password: string }>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(credentials).toString(),
      }),
      invalidatesTags: ['Auth'],
      // You might want to handle token storage here after a successful login
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const responseData = data?.data || data; // Handle nested data structure
          const token = responseData?.access_token || (responseData as any)?.token;

          if (token) {
            await AsyncStorage.setItem('userToken', token);
            console.log('Token stored via onQueryStarted:', token);
          }
        } catch (error) {
          console.error("Login failed or no token received:", error);
        }
      },
    }),
    forgotPassword: builder.mutation<GenericResponse, { email: string }>({
      query: (body) => ({
        url: 'auth/forgot-password', // Assuming this path
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
    resetPassword: builder.mutation<GenericResponse, { token: string; newPassword: string }>({
      query: (body) => ({
        url: 'auth/reset-password', // Assuming this path
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),

    // --- Public/Guest Endpoints (from GUEST_API_REFERENCE.md and API_DOCUMENTATION.md) ---
    getDiscoverContent: builder.query<DiscoverContentResponse, void>({
      query: () => 'discover/public/',
      providesTags: ['Content'],
    }),
    getTrendingContent: builder.query<TrendingContentResponse, { type: string }>({
      query: ({ type }) => `discover/public/trending/?type=${type}`,
      providesTags: ['Content'],
    }),
    getGenres: builder.query<any, void>({
      query: () => 'discover/public/genres/',
      providesTags: ['Content'],
    }),
    getPublicRecommendations: builder.query<any, { type: string }>({
      query: ({ type }) => `recommendations/public/?type=${type}`,
      providesTags: ['Content'],
    }),
    getMovieDetails: builder.query<any, string>({
      query: (movieId) => `content/public/movie/${movieId}/`,
      providesTags: ['Content'],
      transformResponse: (response: { data: any }) => response.data,
    }),
    getMangaDetails: builder.query<any, string>({
      query: (mangaId) => `content/public/manga/${mangaId}/`,
      providesTags: ['Content'],
      transformResponse: (response: { data: any }) => response.data,
    }),
    getAnimeDetails: builder.query<any, string>({
      query: (animeId) => `content/public/anime/${animeId}/`,
      providesTags: ['Content'],
      transformResponse: (response: { data: any }) => response.data,
    }),
    getTrackDetails: builder.query<Track, string>({
      query: (trackId) => `content/public/track/${trackId}/`,
      providesTags: ['Content'],
      transformResponse: (response: { data: Track }) => response.data,
    }),
    getArtistDetails: builder.query<Artist, string>({
      query: (artistId) => `content/public/artist/${artistId}/`,
      providesTags: ['Content'],
      transformResponse: (response: { data: Artist }) => response.data,
    }),
    getAlbumDetails: builder.query<Album, string>({
      query: (albumId) => `content/public/album/${albumId}/`,
      providesTags: ['Content'],
      transformResponse: (response: { data: Album }) => response.data,
    }),
    searchContent: builder.query<any, string>({
      query: (query) => `search/?q=${query}`, // Assuming a search endpoint based on previous implementation
      providesTags: ['Content'],
    }),
    getDiscoveryCards: builder.query<any, void>({
      query: () => 'matching/discover', // Updated path from API_DOCUMENTATION.md
      providesTags: ['Matching'],
      transformResponse: (response: { data: any }) => response.data,
    }),

    // --- Playlist Endpoints ---
    getUserPlaylists: builder.query<Playlist[], void>({
      query: () => 'playlists/me',
      providesTags: ['Playlists'],
    }),
    createPlaylist: builder.mutation<{ data: Playlist }, { name: string; description?: string; cover_url?: string }>({
      query: (body) => ({
        url: 'playlists',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Playlists'],
    }),
    addTrackToPlaylist: builder.mutation<any, { playlistId: string; trackId: string }>({
      query: ({ playlistId, trackId }) => ({
        url: `playlists/${playlistId}/tracks`,
        method: 'POST',
        body: { track_id: trackId },
      }),
      invalidatesTags: ['Playlists'],
    }),

    // --- Authenticated Endpoints (from API_DOCUMENTATION.md) ---
    getUserProfile: builder.query<User, string>({
      query: (userId) => `users/profile/${userId}`, // Specific user profile
      providesTags: (result, error, userId) => [{ type: 'User', id: userId }],
    }),
    getMyProfile: builder.query<User, void>({
      query: () => 'users/profile', // Current user's profile
      providesTags: ['Profile'],
    }),
    updateMyProfile: builder.mutation<User, Partial<User>>({
      query: (body) => ({
        url: 'users/profile',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
    getUserActivity: builder.query<any, { userId: string; limit?: number }>({
      query: ({ userId, limit = 20 }) => `users/${userId}/activity/recent?limit=${limit}`, // Using /users/{user_id}/activity/recent
      providesTags: (result, error, { userId }) => [{ type: 'Activity', id: userId }],
      transformResponse: (response: { data: any }) => response.data,
    }),
    getMatchHistory: builder.query<any, { status?: string; limit?: number }>({
      query: ({ status, limit = 50 }) => `matching/matches?status=${status || ''}&limit=${limit}`, // Using /matching/matches
      providesTags: ['Matching'],
      transformResponse: (response: { data: any }) => response.data,
    }),
    getMatchingBuds: builder.query<User[], { limit?: number }>({
      query: ({ limit = 10 }) => `matching/discover?limit=${limit}`, // Updated path from API_DOCUMENTATION.md
      providesTags: ['Matching'],
      transformResponse: (response: { data: User[] }) => response.data,
    }),
    swipeUser: builder.mutation<any, { userId: string; action: 'like' | 'pass' | 'super_like' }>({
      query: ({ userId, action }) => ({
        url: 'matching/swipe',
        method: 'POST',
        body: { user_id: userId, action },
      }),
      invalidatesTags: ['Matching'],
    }),
    getChatChannels: builder.query<ChatChannel[], { status?: string; limit?: number } | void>({
      query: (arg) => {
        const { status, limit = 50 } = arg || {};
        return `chat/conversations?status=${status || ''}&limit=${limit}`;
      },
      providesTags: ['Chat'],
    }),
    getConnections: builder.query<User[], { limit?: number }>({ // Renamed from getBuds
      query: ({ limit = 100 }) => `matching/connections?limit=${limit}`,
      providesTags: ['Connections'], // Changed to 'Connections' tag type
      transformResponse: (response: { data: User[] }) => response.data,
    }),
    getChatUsers: builder.query<User[], void>({ // No specific endpoint for 'chat users' in doc, using conversations for now
      query: () => 'chat/conversations', // This needs clarification, assuming conversations are with users
      providesTags: ['Chat'],
    }),
    getEventDetails: builder.query<any, string>({
      query: (eventId) => `events/${eventId}/`, // This is hypothetical, not in API_DOCUMENTATION.md
      providesTags: ['Events'],
      transformResponse: (response: { data: any }) => response.data,
    }),
    getStories: builder.query<any, void>({
      query: () => 'stories/',
      providesTags: ['Stories'],
      transformResponse: (response: { data: any }) => response.data,
    }),
    getChatMessages: builder.query<ChatMessage[], string>({
      query: (channelId) => `chat/conversations/${channelId}/messages`,
      providesTags: (result, error, channelId) => [{ type: 'Chat', id: channelId }],
    }),
    sendMessage: builder.mutation<ChatMessage, { channelId: string; content: string }>({
      query: ({ channelId, content }) => ({
        url: `chat/conversations/${channelId}/messages`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: (result, error, { channelId }) => [{ type: 'Chat', id: channelId }],
    }),
    getChatChannelDetails: builder.query<ChatChannel, string>({
      query: (channelId) => `chat/conversations/${channelId}`,
      providesTags: (result, error, channelId) => [{ type: 'Chat', id: channelId }],
    }),
  }),
});

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at?: string;
  sender?: User; // Optional expanded sender details
}

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useRegisterMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,

  useGetDiscoverContentQuery,
  useGetTrendingContentQuery,
  useGetGenresQuery,
  useGetPublicRecommendationsQuery,
  useGetMovieDetailsQuery,
  useGetMangaDetailsQuery,
  useGetAnimeDetailsQuery,
  useGetTrackDetailsQuery,
  useGetArtistDetailsQuery,
  useGetAlbumDetailsQuery,
  useSearchContentQuery,
  useGetDiscoveryCardsQuery,

  useGetUserPlaylistsQuery,
  useCreatePlaylistMutation,
  useAddTrackToPlaylistMutation,

  useGetUserProfileQuery,
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useGetUserActivityQuery,
  useGetMatchHistoryQuery,
  useGetMatchingBudsQuery,
  useSwipeUserMutation,
  useGetChatChannelsQuery,
  useGetConnectionsQuery, // Renamed from useGetBudsQuery
  useGetChatUsersQuery,
  useGetEventDetailsQuery,
  useGetStoriesQuery,
  useGetChatMessagesQuery,
  useSendMessageMutation,
  useGetChatChannelDetailsQuery,
} = baseApi;
