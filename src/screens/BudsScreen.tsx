import React from 'react';
import { SafeImage } from '../components/common/SafeImage';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useMatching } from '../hooks/useMatching';
import { LinearGradient } from 'expo-linear-gradient';
import { DesignSystem } from '../theme/design_system';
import { ModernButton } from '../components/common/ModernButton';

const BudsScreen = () => {
  const router = useRouter();
  const { connections, connectionsError, isConnectionsLoading } = useMatching();

  if (isConnectionsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color={DesignSystem.colors.primaryRed} />
      </View>
    );
  }

  if (connectionsError) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.errorText}>Unable to load connections.</Text>
        <ModernButton text="Retry" variant="secondary" onPressed={() => { }} />
      </View>
    );
  }


  const renderBudItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.budItemContainer}
      onPress={() => router.push(`/UserProfileScreen/${item.id}`)}
    >
      <LinearGradient
        colors={[DesignSystem.colors.surfaceContainerHighest, DesignSystem.colors.surfaceContainer]}
        style={styles.budItem}
      >
        <SafeImage source={{ uri: item.avatar_url || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }} style={styles.budAvatar} />
        <View style={styles.budDetails}>
          <Text style={styles.budName}>{item.first_name ? `${item.first_name} ${item.last_name || ''}` : item.username}</Text>
          <Text style={styles.budUsername}>@{item.username}</Text>
        </View>
        <View style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Message</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.screenTitle}>My Buds</Text>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{connections.length}</Text>
        </View>
      </View>

      <FlatList
        data={connections}
        keyExtractor={(item) => item.id}
        renderItem={renderBudItem}
        contentContainerStyle={styles.budsList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No connections yet.</Text>
            <Text style={styles.emptySubText}>Start swiping to find your music buds!</Text>
            <ModernButton
              text="Find Buds"
              onPressed={() => router.push('/(tabs)/MatchingScreen' as any)}
              style={styles.findButton}
            />
          </View>
        }
      />
    </View>
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
    paddingBottom: DesignSystem.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  screenTitle: {
    color: DesignSystem.colors.onSurface,
    ...DesignSystem.typography.displaySmall,
  },
  headerBadge: {
    backgroundColor: DesignSystem.colors.surfaceContainerHighest,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: DesignSystem.radius.sm,
    marginLeft: 10,
  },
  headerBadgeText: {
    color: DesignSystem.colors.primaryRed,
    ...DesignSystem.typography.labelLarge,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: DesignSystem.colors.backgroundPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: DesignSystem.colors.backgroundPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: DesignSystem.colors.errorRed,
    ...DesignSystem.typography.bodyLarge,
    marginBottom: DesignSystem.spacing.md,
  },
  budsList: {
    paddingHorizontal: DesignSystem.spacing.md,
    paddingBottom: DesignSystem.spacing.xl,
  },
  budItemContainer: {
    marginBottom: DesignSystem.spacing.sm,
    borderRadius: DesignSystem.radius.lg,
    overflow: 'hidden',
  },
  budItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: DesignSystem.spacing.md,
    borderRadius: DesignSystem.radius.lg,
    borderWidth: 1,
    borderColor: DesignSystem.colors.borderColor,
  },
  budAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: DesignSystem.colors.surfaceContainerHighest,
    borderWidth: 1,
    borderColor: DesignSystem.colors.borderColor,
  },
  budDetails: {
    flex: 1,
    marginLeft: DesignSystem.spacing.md,
  },
  budName: {
    color: DesignSystem.colors.onSurface,
    ...DesignSystem.typography.titleMedium,
    marginBottom: 2,
  },
  budUsername: {
    color: DesignSystem.colors.textMuted,
    ...DesignSystem.typography.bodySmall,
  },
  actionButton: {
    paddingHorizontal: DesignSystem.spacing.md,
    paddingVertical: DesignSystem.spacing.xs,
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    borderRadius: DesignSystem.radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(233, 30, 99, 0.3)',
  },
  actionButtonText: {
    color: DesignSystem.colors.primaryRed,
    ...DesignSystem.typography.labelMedium,
    fontWeight: '600',
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    color: DesignSystem.colors.onSurface,
    ...DesignSystem.typography.titleLarge,
    marginBottom: DesignSystem.spacing.xs,
  },
  emptySubText: {
    color: DesignSystem.colors.textMuted,
    ...DesignSystem.typography.bodyMedium,
    textAlign: 'center',
    marginBottom: DesignSystem.spacing.xl,
  },
  findButton: {
    paddingHorizontal: DesignSystem.spacing.xl,
    borderRadius: DesignSystem.radius.full,
  },
});

export default BudsScreen;