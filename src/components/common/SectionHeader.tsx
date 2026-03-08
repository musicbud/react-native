import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { DesignSystem } from '../../theme/design_system';

interface SectionHeaderProps {
    title: string;
    actionText?: string;
    onActionPressed?: () => void;
    style?: ViewStyle;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    actionText,
    onActionPressed,
    style,
}) => {
    return (
        <View style={[styles.headerContainer, style]}>
            <Text style={styles.title}>{title}</Text>
            {actionText && onActionPressed && (
                <TouchableOpacity onPress={onActionPressed}>
                    <Text style={styles.actionText}>{actionText}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: DesignSystem.spacing.md,
        marginBottom: DesignSystem.spacing.sm,
    },
    title: {
        ...DesignSystem.typography.headlineSmall,
        color: DesignSystem.colors.onSurface,
        fontWeight: '700',
    },
    actionText: {
        ...DesignSystem.typography.bodySmall,
        color: DesignSystem.colors.primary,
        fontWeight: '600',
    },
});
