import { expect, test } from '@playwright/test'

test.describe('responsive smoke', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('mobile viewport keeps the main flow usable', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('button', { name: /vowel presets/i }).click()
    await page.getByRole('option', { name: /^Short Vowels/i }).click()

    await expect(page.getByRole('region', { name: /preview/i })).toContainText(
      /thai vowels writing practice/i,
    )
    await expect(
      page.getByRole('button', { name: /download pdf/i }),
    ).toBeVisible()
    await expect(
      page.getByText(/scroll sideways to view all columns/i),
    ).toHaveCount(0)
  })
})
