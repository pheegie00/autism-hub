import { test, expect } from '@playwright/test';

test.describe('All Pages Load', () => {
  const pages = [
    { path: '/', title: 'Maryland Autism Hub' },
    { path: '/research', title: 'Research' },
    { path: '/directory', title: 'Provider Directory' },
    { path: '/news', title: 'Latest News' },
    { path: '/organizations', title: 'Organizations' },
    { path: '/ai-recommendations', title: 'AI' },
  ];

  for (const p of pages) {
    test(`${p.path} loads without errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error' && !msg.text().includes('favicon')) {
          errors.push(msg.text());
        }
      });

      const response = await page.goto(p.path);
      
      // Check page loads successfully
      expect(response?.status()).toBeLessThan(400);
      
      // Check page has expected content
      await expect(page.locator('h1')).toBeVisible();
      
      // No critical errors
      const criticalErrors = errors.filter(e => 
        !e.includes('404') && 
        !e.includes('hydration')
      );
      expect(criticalErrors).toHaveLength(0);
    });
  }
});

test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('homepage is mobile friendly', async ({ page }) => {
    await page.goto('/');
    
    // Header should be visible
    await expect(page.locator('h1')).toBeVisible();
    
    // Buttons should be accessible
    await expect(page.locator('text=Find Services')).toBeVisible();
  });

  test('research page is mobile friendly', async ({ page }) => {
    await page.goto('/research');
    
    // Search form should be visible
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
    
    // Quick filters should wrap properly (at least one visible)
    await expect(page.locator('button:has-text("microbiome")')).toBeVisible();
  });
});
