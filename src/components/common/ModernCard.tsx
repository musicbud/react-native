import React from 'react';
import { SafeImage } from '../../components/common/SafeImage';
import { View, Text, StyleSheet, Image, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { DesignSystem } from '../../theme/design_system';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export type ModernCardVariant = 'primary' | 'secondary' | 'accent' | 'elevated' | 'outlined' | 'gradient' | 'glass';

interface ModernCardProps {
    children: React.ReactNode;
    variant?: ModernCardVariant;
    padding?: number;
    margin?: number;
    borderRadius?: number;
    onTap?: () => void;
    backgroundColor?: string;
    style?: StyleProp<ViewStyle>;
}

export const ModernCard: React.FC<ModernCardProps> = ({
    children,
    variant = 'primary',
    padding = DesignSystem.spacing.lg,
    margin = DesignSystem.spacing.md,
    borderRadius = DesignSystem.radius.xl,
    onTap,
    backgroundColor,
    style,
}) => {
    const getBackgroundColor = () => {
        if (backgroundColor) return backgroundColor;
        switch (variant) {
            case 'primary': return DesignSystem.colors.cardBackground;
            case 'secondary': return DesignSystem.colors.surfaceContainer;
            case 'accent': return DesignSystem.colors.surfaceContainerHigh;
            case 'elevated': return DesignSystem.colors.surfaceContainerHighest;
            case 'glass': return 'rgba(255, 255, 255, 0.08)';
            case 'outlined':
            case 'gradient':
                return 'transparent';
            default: return DesignSystem.colors.cardBackground;
        }
    };

    const getBorderArgs = () => {
        if (variant === 'outlined') return { borderWidth: 1, borderColor: DesignSystem.colors.borderColor };
        return {};
    };

    const CardWrapper = onTap ? TouchableOpacity : View;

    // Need to cast to any for Component typing if it complains in older RN/TypeScript setups
    const BaseWrapper: any = CardWrapper;

    const content = (
        <BaseWrapper
            onPress={onTap}
            style={[
                styles.card,
                {
                    backgroundColor: getBackgroundColor(),
                    margin,
                    borderRadius,
                    padding: variant === 'gradient' ? 0 : padding,
                },
                getBorderArgs(),
                style,
            ]}
        >
            {children}
        </BaseWrapper>
    );

    if (variant === 'glass') {
        return (
            <BaseWrapper onPress={onTap} style={[{ margin, borderRadius, overflow: 'hidden' }, style]}>
                <View style={[styles.card, { backgroundColor: getBackgroundColor(), padding, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }]}>
                    {children}
                </View>
            </BaseWrapper>
        );
    }

    if (variant === 'gradient') {
        return (
            <BaseWrapper onPress={onTap} style={[{ margin, borderRadius, overflow: 'hidden' }, style]}>
                <LinearGradient colors={[DesignSystem.colors.surfaceContainer, DesignSystem.colors.surfaceContainerHigh]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding }}>
                    {children}
                </LinearGradient>
            </BaseWrapper>
        );
    }

    return content;
};

// Specialized MusicCard
interface MusicCardProps {
    title: string;
    subtitle: string;
    imageUrl?: string;
    icon?: keyof typeof Ionicons.glyphMap;
    iconColor?: string;
    onTap?: () => void;
    isPlaying?: boolean;
    isLiked?: boolean;
    style?: ViewStyle;
}

export const MusicCard: React.FC<MusicCardProps> = ({
    title,
    subtitle,
    imageUrl,
    icon = 'musical-note',
    iconColor = DesignSystem.colors.primary,
    onTap,
    isPlaying = false,
    isLiked = false,
    style
}) => {
    return (
        <ModernCard variant="primary" onTap={onTap} style={[{ width: 104 }, style]} padding={0} margin={DesignSystem.spacing.xs}>
            <View style={{ padding: DesignSystem.spacing.xxs }}>
                <View style={[styles.musicImageContainer, { height: 102 }]}>
                    {imageUrl ? (
                        <SafeImage source={{ uri: imageUrl }} style={styles.musicImage} />
                    ) : (
                        <LinearGradient colors={[DesignSystem.colors.surfaceContainerHigh, DesignSystem.colors.surfaceContainerHighest]} style={styles.fallbackIcon}>
                            <Ionicons name={icon} size={32} color={iconColor} />
                        </LinearGradient>
                    )}
                </View>
                <Text style={[styles.musicTitle, { fontSize: 12 }]} numberOfLines={1}>{title}</Text>
                <Text style={[styles.musicSubtitle, { fontSize: 10 }]} numberOfLines={1}>{subtitle}</Text>
            </View>
        </ModernCard>
    );
};

// Specialized ProfileCard
interface ProfileCardProps {
    name: string;
    subtitle?: string;
    avatarUrl?: string;
    onTap?: () => void;
    style?: ViewStyle;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
    name,
    subtitle,
    avatarUrl,
    onTap,
    style
}) => {
    return (
        <ModernCard variant="primary" onTap={onTap} padding={DesignSystem.spacing.md} margin={DesignSystem.spacing.xs} style={style}>
            <View style={styles.profileRow}>
                {avatarUrl ? (
                    <SafeImage source={{ uri: avatarUrl }} style={styles.profileAvatar} />
                ) : (
                    <View style={[styles.profileAvatar, { backgroundColor: DesignSystem.colors.primary, justifyContent: 'center', alignItems: 'center' }]}>
                        <Ionicons name="person" size={24} color={DesignSystem.colors.onPrimary} />
                    </View>
                )}
                <View style={styles.profileInfo}>
                    <Text style={styles.profileName} numberOfLines={1}>{name}</Text>
                    {subtitle && <Text style={styles.profileSubtitle} numberOfLines={1}>{subtitle}</Text>}
                </View>
            </View>
        </ModernCard>
    );
}


const styles = StyleSheet.create({
    card: {
        overflow: 'hidden',
    },
    musicImageContainer: {
        height: 140,
        width: '100%',
        borderRadius: DesignSystem.radius.lg,
        overflow: 'hidden',
        backgroundColor: DesignSystem.colors.surfaceDark,
        marginBottom: DesignSystem.spacing.sm,
    },
    musicImage: {
        width: '100%',
        height: '100%',
    },
    fallbackIcon: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    musicTitle: {
        ...DesignSystem.typography.titleMedium,
        color: DesignSystem.colors.textPrimary,
        marginBottom: DesignSystem.spacing.xxs,
    },
    musicSubtitle: {
        ...DesignSystem.typography.bodySmall,
        color: DesignSystem.colors.textMuted,
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    profileInfo: {
        marginLeft: DesignSystem.spacing.md,
        flex: 1,
    },
    profileName: {
        ...DesignSystem.typography.titleMedium,
        color: DesignSystem.colors.textPrimary,
    },
    profileSubtitle: {
        ...DesignSystem.typography.bodySmall,
        color: DesignSystem.colors.textMuted,
        marginTop: DesignSystem.spacing.xxs,
    }
});
