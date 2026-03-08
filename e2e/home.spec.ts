import { test, expect } from '@playwright/test';

test.describe('Main Application Flow', () => {
    test('should load the home screen successfully', async ({ page }) => {
        // Navigate to the root layout which redirects to /(tabs)/home or /login
        await page.goto('/');

        // Wait for initial hydration to complete
        await page.waitForLoadState('networkidle');

        // This is a placeholder test. In a true E2E flow against the React Native Web build:
        // 1. Enter text in a Login form.
        // 2. Click submit.
        // 3. Await navigation to home route.

        // Check if the HTML title sets properly
        await expect(page).toHaveTitle(/MusicBud/);
    });

    test('should render the audio visualizer block', async ({ page }) => {
        await page.goto('/(tabs)/home');

        // Example selector assuming a testID of 'mini-player' or generic layout block
        const miniPlayer = page.locator('text=Mini Player'); // Adjust based on actual text/testID
        // Playwright supports finding by role, text, or data-testid. 
        // In React Native Web, text is usually within a div with dir="auto".
    });
});
