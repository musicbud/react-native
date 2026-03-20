import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import { DesignSystem } from '../theme/design_system';
import { ModernButton } from '../components/common/ModernButton';
import { SectionHeader } from '../components/common/SectionHeader';
import { IconSymbol } from '../../components/ui/icon-symbol';
import { getBaseUrl } from '../store/apibase';

interface ServiceConnectCardProps {
    title: string;
    description: string;
    iconName: string;
    iconColor: string;
    onConnect: () => void;
}

const ServiceConnectCard: React.FC<ServiceConnectCardProps> = ({
    title,
    description,
    iconName,
    iconColor,
    onConnect,
}) => (
    <View style={styles.cardContainer}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
            <IconSymbol name={iconName as any} size={28} color={iconColor} />
        </View>
        <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardDescription}>{description}</Text>
        </View>
        <ModernButton
            variant="outline"
            text="Connect"
            onPressed={onConnect}
        />
    </View>
);

const ConnectServicesScreen = () => {
    const handleConnectService = async (serviceName: string) => {
        try {
            const baseUrl = getBaseUrl();
            const loginUrl = `${baseUrl}/v1/${serviceName}/auth/login`;
            const supported = await Linking.canOpenURL(loginUrl);
            if (supported) {
                await Linking.openURL(loginUrl);
            } else {
                Alert.alert('Error', `Cannot open authentication URL for ${serviceName}`);
            }
        } catch (e) {
            console.error(`Failed to handle login redirect for ${serviceName}`, e);
            Alert.alert('Error', `Encountered a problem reaching ${serviceName}`);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.screenTitle}>Connect Services</Text>
                <Text style={styles.screenDescription}>
                    Connect your favorite music and entertainment services to enhance your experience.
                </Text>
            </View>

            <View style={styles.section}>
                <ServiceConnectCard
                    title="Spotify"
                    description="Connect your Spotify account to control playback and access your music library."
                    iconName="music.note"
                    iconColor="#1DB954"
                    onConnect={() => handleConnectService('spotify')}
                />

                <ServiceConnectCard
                    title="YouTube Music"
                    description="Link your YouTube Music account for seamless music streaming."
                    iconName="play.circle.fill"
                    iconColor="#FF0000"
                    onConnect={() => handleConnectService('youtube')}
                />

                <ServiceConnectCard
                    title="Last.fm"
                    description="Connect Last.fm to track your listening habits and discover new music."
                    iconName="radio.fill"
                    iconColor="#D51007"
                    onConnect={() => handleConnectService('lastfm')}
                />

                <ServiceConnectCard
                    title="MyAnimeList"
                    description="Link your MyAnimeList account to share your anime preferences."
                    iconName="tv.fill"
                    iconColor="#2E51A2"
                    onConnect={() => handleConnectService('mal')}
                />
            </View>

            <View style={styles.section}>
                <SectionHeader title="Connected Services" />
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Connect services above to see them listed here</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DesignSystem.colors.backgroundPrimary,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: DesignSystem.spacing.md,
        paddingBottom: DesignSystem.spacing.lg,
    },
    screenTitle: {
        color: DesignSystem.colors.onSurface,
        ...DesignSystem.typography.displaySmall,
        marginBottom: DesignSystem.spacing.sm,
    },
    screenDescription: {
        color: DesignSystem.colors.textSecondary,
        ...DesignSystem.typography.bodyLarge,
    },
    section: {
        paddingHorizontal: DesignSystem.spacing.md,
        marginBottom: DesignSystem.spacing.xl,
    },
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: DesignSystem.colors.surfaceContainer,
        borderRadius: DesignSystem.radius.sm,
        padding: DesignSystem.spacing.md,
        marginBottom: DesignSystem.spacing.md,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: DesignSystem.spacing.md,
    },
    cardContent: {
        flex: 1,
        marginRight: DesignSystem.spacing.md,
    },
    cardTitle: {
        color: DesignSystem.colors.onSurface,
        ...DesignSystem.typography.titleMedium,
        marginBottom: 4,
    },
    cardDescription: {
        color: DesignSystem.colors.textSecondary,
        ...DesignSystem.typography.bodySmall,
    },
    emptyContainer: {
        paddingVertical: DesignSystem.spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        color: DesignSystem.colors.textMuted,
        ...DesignSystem.typography.bodyMedium,
    }
});

export default ConnectServicesScreen;
