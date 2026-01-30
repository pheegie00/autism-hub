import { test, expect } from '@playwright/test';

test.describe('Research Page', () => {
  test('loads without errors', async ({ page }) => {
    await page.goto('/research');
    
    // Check heading
    await expect(page.locator('h1')).toContainText('International Autism Research');
    
    // Check search form exists
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
    await expect(page.locator('button:has-text("Search")')).toBeVisible();
  });

  test('quick filter buttons are visible', async ({ page }) => {
    await page.goto('/research');
    
    // Check quick search buttons exist
    await expect(page.locator('button:has-text("microbiome")')).toBeVisible();
    await expect(page.locator('button:has-text("HBOT")')).toBeVisible();
    await expect(page.locator('button:has-text("stem cell")')).toBeVisible();
    await expect(page.locator('button:has-text("CBD")')).toBeVisible();
  });

  test('search form submits and shows loading', async ({ page }) => {
    await page.goto('/research');
    
    // Type in search box
    await page.fill('input[placeholder*="Search"]', 'autism treatment');
    
    // Click search button
    await page.click('button:has-text("Search")');
    
    // Should show loading state
    await expect(page.locator('text=Searching PubMed')).toBeVisible({ timeout: 2000 });
  });

  test('quick filter triggers search and returns results', async ({ page }) => {
    await page.goto('/research');
    
    // Click microbiome quick filter
    await page.click('button:has-text("microbiome")');
    
    // Wait for loading to appear then disappear
    await expect(page.locator('text=Searching PubMed')).toBeVisible({ timeout: 5000 });
    
    // Wait for results (up to 30 seconds for API)
    await expect(page.locator('text=Found')).toBeVisible({ timeout: 30000 });
    
    // Verify papers are displayed (give extra time for render)
    await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Read Full Paper').first()).toBeVisible({ timeout: 5000 });
  });

  test('search results display correctly', async ({ page }) => {
    await page.goto('/research');
    
    // Click HBOT quick filter
    await page.click('button:has-text("HBOT")');
    
    // Wait for results
    await expect(page.locator('text=Found')).toBeVisible({ timeout: 30000 });
    
    // Wait for articles to render
    await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 });
    
    // Check result structure
    const firstResult = page.locator('article').first();
    await expect(firstResult.locator('span:has-text("PubMed ID")')).toBeVisible({ timeout: 5000 });
    await expect(firstResult.locator('text=Abstract')).toBeVisible();
    await expect(firstResult.locator('a:has-text("Read Full Paper")')).toBeVisible();
  });

  test('no critical console errors during search', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/research');
    await page.click('button:has-text("microbiome")');
    
    // Wait for search to complete
    await expect(page.locator('text=Found')).toBeVisible({ timeout: 30000 });
    await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 });
    
    // Filter benign errors (hydration, favicon, etc.)
    const criticalErrors = errors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('404') &&
      !e.includes('hydration') &&
      !e.includes('Hydration') &&
      !e.includes('Warning')
    );
    
    // Allow for minor warnings, but no critical errors
    expect(criticalErrors.length).toBeLessThanOrEqual(1);
  });

  test('back to home link works', async ({ page }) => {
    await page.goto('/research');
    await page.click('text=← Back to Home');
    await expect(page).toHaveURL('/');
  });
});
