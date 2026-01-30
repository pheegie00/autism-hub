import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads without errors', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    await expect(page).toHaveTitle(/Maryland Autism Hub/);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Maryland Autism Hub');
    
    // Check hero buttons exist
    await expect(page.locator('text=Find Services')).toBeVisible();
    await expect(page.locator('text=Explore Research')).toBeVisible();
  });

  test('feature cards are visible', async ({ page }) => {
    await page.goto('/');
    
    // Check all 4 feature cards (use h2 to be specific)
    await expect(page.locator('h2:has-text("Latest News")')).toBeVisible();
    await expect(page.locator('h2:has-text("Provider Directory")')).toBeVisible();
    await expect(page.locator('h2:has-text("Research Search")')).toBeVisible();
    await expect(page.locator('h2:has-text("Organizations")')).toBeVisible();
  });

  test('AI recommendations CTA is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Get Personalized Therapy Recommendations')).toBeVisible();
  });

  test('navigation links work', async ({ page }) => {
    await page.goto('/');
    
    // Click Research link and verify navigation
    await page.click('text=Research Search');
    await expect(page).toHaveURL(/\/research/);
    
    // Go back and try Directory
    await page.goto('/');
    await page.click('text=Provider Directory');
    await expect(page).toHaveURL(/\/directory/);
  });

  test('no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out expected/benign errors
    const realErrors = errors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('404')
    );
    
    expect(realErrors).toHaveLength(0);
  });
});
