import React from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, SafeAreaView, StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DesignSystem } from '../theme/design_system';

interface SettingRowProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    subtitle?: string;
    onPress?: () => void;
    isToggle?: boolean;
    toggleValue?: boolean;
    onToggleChange?: (val: boolean) => void;
    danger?: boolean;
}

const SettingRow = ({ icon, label, subtitle, onPress, isToggle, toggleValue, onToggleChange, danger }: SettingRowProps) => (
    <TouchableOpacity
        style={styles.settingRow}
        onPress={onPress}
        activeOpacity={isToggle ? 1 : 0.7}
        disabled={isToggle}
    >
        <View style={[styles.iconContainer, danger && styles.dangerIconBg]}>
            <Ionicons name={icon} size={18} color={danger ? DesignSystem.colors.errorRed : DesignSystem.colors.primaryRed} />
        </View>
        <View style={styles.rowContent}>
            <Text style={[styles.rowLabel, danger && styles.dangerLabel]}>{label}</Text>
            {subtitle && <Text style={styles.rowSubtitle}>{subtitle}</Text>}
        </View>
        {isToggle ? (
            <Switch
                value={toggleValue}
                onValueChange={onToggleChange}
                trackColor={{ false: DesignSystem.colors.surfaceContainerHighest, true: DesignSystem.colors.primaryRed }}
                thumbColor={DesignSystem.colors.onPrimary}
            />
        ) : (
            !danger && <Ionicons name="chevron-forward" size={16} color={DesignSystem.colors.textMuted} />
        )}
    </TouchableOpacity>
);

const SettingsScreen = () => {
    const router = useRouter();
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
    const [darkMode, setDarkMode] = React.useState(true);
    const [autoPlay, setAutoPlay] = React.useState(false);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={22} color={DesignSystem.colors.onSurface} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Settings</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Account Settings */}
                    <Text style={styles.sectionHeader}>Account</Text>
                    <View style={styles.card}>
                        <SettingRow icon="person" label="Edit Profile" onPress={() => router.push('/ProfileScreen')} />
                        <SettingRow icon="shield-checkmark" label="Privacy" onPress={() => console.log('Privacy')} />
                        <SettingRow icon="lock-closed" label="Change Password" onPress={() => router.push('/ChangePassScreen')} />
                    </View>

                    {/* Discovery Settings */}
                    <Text style={styles.sectionHeader}>Discovery</Text>
                    <View style={styles.card}>
                        <SettingRow icon="compass" label="Discovery Preferences" subtitle="Adjust your matching filters" onPress={() => console.log('Discovery')} />
                        <SettingRow icon="location" label="Location" subtitle="Used for nearby matches" onPress={() => console.log('Location')} />
                    </View>

                    {/* Notifications */}
                    <Text style={styles.sectionHeader}>Preferences</Text>
                    <View style={styles.card}>
                        <SettingRow
                            icon="notifications"
                            label="Notifications"
                            isToggle
                            toggleValue={notificationsEnabled}
                            onToggleChange={setNotificationsEnabled}
                        />
                        <SettingRow
                            icon="moon"
                            label="Dark Mode"
                            isToggle
                            toggleValue={darkMode}
                            onToggleChange={setDarkMode}
                        />
                        <SettingRow
                            icon="play-circle"
                            label="Auto-play"
                            subtitle="Continue playing similar tracks"
                            isToggle
                            toggleValue={autoPlay}
                            onToggleChange={setAutoPlay}
                        />
                    </View>

                    {/* Help & Support */}
                    <Text style={styles.sectionHeader}>Support</Text>
                    <View style={styles.card}>
                        <SettingRow icon="help-circle" label="Help & Support" onPress={() => console.log('Help')} />
                        <SettingRow icon="document-text" label="Terms of Service" onPress={() => console.log('Terms')} />
                        <SettingRow icon="shield" label="Privacy Policy" onPress={() => console.log('Policy')} />
                        <SettingRow icon="star" label="Rate App" onPress={() => console.log('Rate')} />
                    </View>

                    {/* Danger Zone */}
                    <View style={styles.card}>
                        <SettingRow icon="log-out" label="Logout" danger onPress={() => console.log('Logout')} />
                        <SettingRow icon="trash" label="Delete Account" danger onPress={() => console.log('Delete')} />
                    </View>

                    <Text style={styles.versionText}>MusicBud v1.0.0</Text>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: DesignSystem.colors.backgroundPrimary },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: DesignSystem.spacing.md, paddingTop: 12, paddingBottom: DesignSystem.spacing.md },
    backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: DesignSystem.colors.surfaceContainerHighest, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { color: DesignSystem.colors.onSurface, ...DesignSystem.typography.titleLarge },
    scrollContent: { paddingHorizontal: DesignSystem.spacing.md, paddingBottom: 40 },
    sectionHeader: { color: DesignSystem.colors.textMuted, ...DesignSystem.typography.labelSmall, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10, marginTop: 24, marginLeft: 4 },
    card: { backgroundColor: DesignSystem.colors.surfaceContainer, borderRadius: DesignSystem.radius.lg, overflow: 'hidden', marginBottom: 4 },
    settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: DesignSystem.spacing.md, paddingHorizontal: DesignSystem.spacing.md, borderBottomWidth: 1, borderBottomColor: DesignSystem.colors.borderColor },
    iconContainer: { width: 34, height: 34, borderRadius: DesignSystem.radius.sm, backgroundColor: 'rgba(233, 30, 99, 0.15)', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
    dangerIconBg: { backgroundColor: 'rgba(255,59,48,0.12)' },
    rowContent: { flex: 1 },
    rowLabel: { color: DesignSystem.colors.onSurface, ...DesignSystem.typography.bodyLarge, fontWeight: '500' },
    dangerLabel: { color: DesignSystem.colors.errorRed },
    rowSubtitle: { color: DesignSystem.colors.textSecondary, ...DesignSystem.typography.bodySmall, marginTop: 2 },
    versionText: { color: DesignSystem.colors.textMuted, ...DesignSystem.typography.labelLarge, textAlign: 'center', marginTop: 24 },
});

export default SettingsScreen;
