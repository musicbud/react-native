import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, View } from 'react-native';
import { DesignSystem } from '../../theme/design_system';
import { Ionicons } from '@expo/vector-icons';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'text';
type ButtonSize = 'small' | 'medium' | 'large' | 'extraLarge';

interface ModernButtonProps {
    text: string;
    onPressed?: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: keyof typeof Ionicons.glyphMap;
    trailingIcon?: keyof typeof Ionicons.glyphMap;
    isLoading?: boolean;
    isFullWidth?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    disabled?: boolean;
}

export const ModernButton: React.FC<ModernButtonProps> = ({
    text,
    onPressed,
    variant = 'primary',
    size = 'medium',
    icon,
    trailingIcon,
    isLoading = false,
    isFullWidth = false,
    style,
    textStyle,
    disabled = false,
}) => {
    const getBackgroundColor = () => {
        if (disabled || !onPressed) return DesignSystem.colors.textMuted;
        switch (variant) {
            case 'primary': return DesignSystem.colors.primaryRed;
            case 'secondary': return DesignSystem.colors.surfaceDark;
            case 'accent': return DesignSystem.colors.accentBlue;
            case 'outline':
            case 'text':
                return 'transparent';
            default: return DesignSystem.colors.primaryRed;
        }
    };

    const getBorderColor = () => {
        if (disabled || !onPressed) return DesignSystem.colors.textMuted;
        if (variant === 'outline') return DesignSystem.colors.primaryRed;
        return 'transparent';
    };

    const getTextColor = () => {
        if (disabled || !onPressed) return DesignSystem.colors.surfaceContainer;
        switch (variant) {
            case 'primary':
            case 'accent':
                return DesignSystem.colors.onPrimary;
            case 'secondary':
                return DesignSystem.colors.textPrimary;
            case 'outline':
            case 'text':
                return DesignSystem.colors.primaryRed;
            default: return DesignSystem.colors.onPrimary;
        }
    };

    const getPadding = () => {
        switch (size) {
            case 'small': return { height: 32, paddingHorizontal: DesignSystem.spacing.md };
            case 'medium': return { height: 44, paddingHorizontal: DesignSystem.spacing.lg };
            case 'large': return { height: 56, paddingHorizontal: DesignSystem.spacing.xl };
            case 'extraLarge': return { height: 64, paddingHorizontal: DesignSystem.spacing.xxl };
            default: return { height: 44, paddingHorizontal: DesignSystem.spacing.lg };
        }
    };

    const getBorderRadius = () => {
        switch (size) {
            case 'small': return DesignSystem.radius.sm;
            case 'medium': return DesignSystem.radius.md;
            case 'large': return DesignSystem.radius.lg;
            case 'extraLarge': return DesignSystem.radius.xl;
            default: return DesignSystem.radius.full;
        }
    };

    const getTypography = () => {
        switch (size) {
            case 'small': return { ...DesignSystem.typography.caption, fontWeight: '600' as const };
            case 'medium': return { ...DesignSystem.typography.bodySmall, fontWeight: '600' as const };
            case 'large': return { ...DesignSystem.typography.bodyMedium, fontWeight: '600' as const };
            case 'extraLarge': return { ...DesignSystem.typography.titleSmall, fontWeight: '600' as const };
            default: return { ...DesignSystem.typography.bodySmall, fontWeight: '600' as const };
        }
    };

    const getIconSize = () => {
        switch (size) {
            case 'small': return 16;
            case 'medium': return 20;
            case 'large': return 24;
            case 'extraLarge': return 28;
            default: return 20;
        }
    };

    const textColor = getTextColor();

    return (
        <TouchableOpacity
            disabled={disabled || isLoading || !onPressed}
            onPress={onPressed}
            style={[
                styles.button,
                getPadding(),
                {
                    backgroundColor: getBackgroundColor(),
                    borderColor: getBorderColor(),
                    borderWidth: variant === 'outline' ? 1.5 : 0,
                    borderRadius: getBorderRadius(),
                    width: isFullWidth ? '100%' : undefined,
                },
                style,
            ]}
        >
            {isLoading ? (
                <ActivityIndicator color={textColor} size="small" />
            ) : (
                <View style={styles.content}>
                    {icon && <Ionicons name={icon} size={getIconSize()} color={textColor} style={{ marginRight: text ? DesignSystem.spacing.xs : 0 }} />}
                    {!!text && (
                        <Text style={[getTypography(), { color: textColor }, textStyle]}>
                            {text}
                        </Text>
                    )}
                    {trailingIcon && <Ionicons name={trailingIcon} size={getIconSize()} color={textColor} style={{ marginLeft: text ? DesignSystem.spacing.xs : 0 }} />}
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
