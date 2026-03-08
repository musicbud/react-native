import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';
// Type fallback: The OpenAPI generator does not build an explicit Track model from the Neo4j generic dict returns
export type Track = any;
interface PlayerContextType {
    currentTrack: Track | null;
    isPlaying: boolean;
    positionMillis: number;
    durationMillis: number;
    playTrack: (track: Track) => Promise<void>;
    pauseTrack: () => Promise<void>;
    resumeTrack: () => Promise<void>;
    seekTo: (millis: number) => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayer = () => {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error('usePlayer must be used within a PlayerProvider');
    }
    return context;
};

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [positionMillis, setPositionMillis] = useState(0);
    const [durationMillis, setDurationMillis] = useState(0);

    useEffect(() => {
        return sound
            ? () => {
                console.log('Unloading Sound');
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (status.isLoaded) {
            setPositionMillis(status.positionMillis);
            setDurationMillis(status.durationMillis || 0);
            setIsPlaying(status.isPlaying);
            if (status.didJustFinish) {
                setIsPlaying(false);
                setPositionMillis(0);
            }
        }
    };

    const playTrack = async (track: Track) => {
        try {
            // If same track is requested, just resume
            if (currentTrack?.id === track.id && sound) {
                await resumeTrack();
                return;
            }

            // We need a playable URL. Assuming backend returns audio_url or similar.
            // If undefined, fallback to a dummy royalty-free track for testing.
            const trackUrl = (track as any).audio_url || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

            if (sound) {
                await sound.unloadAsync();
            }

            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                staysActiveInBackground: true,
            });

            console.log('Loading Sound', trackUrl);
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: trackUrl },
                { shouldPlay: true },
                onPlaybackStatusUpdate
            );

            setSound(newSound);
            setCurrentTrack(track);
            setIsPlaying(true);
        } catch (error) {
            console.error("Error playing track:", error);
        }
    };

    const pauseTrack = async () => {
        if (sound) {
            await sound.pauseAsync();
            setIsPlaying(false);
        }
    };

    const resumeTrack = async () => {
        if (sound) {
            await sound.playAsync();
            setIsPlaying(true);
        }
    };

    const seekTo = async (millis: number) => {
        if (sound) {
            await sound.setPositionAsync(millis);
            setPositionMillis(millis);
        }
    };

    return (
        <PlayerContext.Provider
            value={{
                currentTrack,
                isPlaying,
                positionMillis,
                durationMillis,
                playTrack,
                pauseTrack,
                resumeTrack,
                seekTo,
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
};
