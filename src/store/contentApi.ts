import { api } from './apibase';

// Inject a unified content details endpoint into the base API.
// The backend exposes: GET /v1/discover/public/{content_type}/{content_id}/
// content_type: 'track' | 'artist' | 'album' | 'movie' | 'manga' | 'anime'

export type GetContentDetailsApiArg = {
    contentType: string;  // e.g. 'track', 'artist', 'album', 'movie', 'manga', 'anime'
    contentId: string;
};

export type GetContentDetailsApiResponse = any;

export const contentApi = api.injectEndpoints({
    endpoints: (build) => ({
        getContentDetails: build.query<GetContentDetailsApiResponse, GetContentDetailsApiArg>({
            query: ({ contentType, contentId }) => ({
                url: `/v1/discover/public/${contentType}/${contentId}/`,
            }),
        }),
    }),
    overrideExisting: false,
});

export const { useGetContentDetailsQuery } = contentApi;
