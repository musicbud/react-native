import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Canvas, Path, LinearGradient as SkiaLinearGradient, vec } from '@shopify/react-native-skia';
import {
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
    useDerivedValue,
    interpolate,
    Extrapolation,
} from 'react-native-reanimated';
import { DesignSystem } from '../../theme/design_system';

interface Props {
    isPlaying: boolean;
    width?: number;
    height?: number;
}

const BAR_COUNT = 15;

/**
 * A highly performant Skia-based GPU accelerated audio waveform visualizer.
 * Syncs with the `isPlaying` boolean to animate a fluid audio visualization.
 */
export const AudioVisualizer: React.FC<Props> = ({ isPlaying, width = 100, height = 24 }) => {
    // Use a shared value to drive the continuous animation
    const progress = useSharedValue(0);

    useEffect(() => {
        if (isPlaying) {
            progress.value = withRepeat(
                withSequence(
                    withTiming(1, { duration: 1500 }),
                    withTiming(0, { duration: 1500 })
                ),
                -1, // infinite loop
                true // reverse
            );
        } else {
            // Return to flatline
            progress.value = withTiming(0, { duration: 300 });
        }
    }, [isPlaying, progress]);

    // We could construct a complex Skia Path here using reanimated values,
    // but for a React Native Skia fluid line, we can build a dynamic path 
    // string or use individual rounded rects. 

    // For an ultra-premium "Liquid" shape, we can create a continuous animated path:
    const skiaPath = useDerivedValue(() => {
        const p = progress.value;
        let pathStr = `M 0 ${height / 2}`;

        for (let i = 0; i <= BAR_COUNT; i++) {
            const x = i * (width / BAR_COUNT);

            // Create a pseudo-random wave effect based on index and progress
            const waveFrequency = 0.5;
            const offset = i * waveFrequency;
            const amplitude = interpolate(
                Math.sin(p * Math.PI * 2 + offset),
                [-1, 1],
                [2, height / 2],
                Extrapolation.CLAMP
            );

            // If not playing, keep the amplitude minimal
            const currentAmplitude = isPlaying ? amplitude : 2;
            const y = (height / 2) - currentAmplitude;

            if (i === 0) {
                pathStr = `M ${x} ${y}`;
            } else {
                // Smooth cubic bezier interpolation would be here, but using L for line segments is simpler 
                pathStr += ` L ${x} ${y}`;
            }
        }

        // Bottom mirror to give a filled wave center
        for (let i = BAR_COUNT; i >= 0; i--) {
            const x = i * (width / BAR_COUNT);
            const waveFrequency = 0.5;
            const offset = i * waveFrequency;
            const amplitude = interpolate(
                Math.sin(p * Math.PI * 2 + offset),
                [-1, 1],
                [2, height / 2],
                Extrapolation.CLAMP
            );

            const currentAmplitude = isPlaying ? amplitude : 2;
            const y = (height / 2) + currentAmplitude;

            pathStr += ` L ${x} ${y}`;
        }

        pathStr += ' Z';
        return pathStr;
    });

    return (
        <View style={{ width, height, justifyContent: 'center' }}>
            <Canvas style={{ width, height }}>
                <Path path={skiaPath}>
                    <SkiaLinearGradient
                        start={vec(0, 0)}
                        end={vec(width, 0)}
                        colors={[DesignSystem.colors.primary, DesignSystem.colors.accentBlue]}
                    />
                </Path>
            </Canvas>
        </View>
    );
};
