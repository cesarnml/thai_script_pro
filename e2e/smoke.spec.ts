import { expect, test } from '@playwright/test'

test('core worksheet flow works end to end', async ({ page }) => {
  await page.route('**/fonts/*', async (route) => {
    await page.waitForTimeout(150)
    await route.continue()
  })

  await page.goto('/')

  const preview = page.getByRole('region', { name: /preview/i })

  await page.getByRole('button', { name: /consonant presets/i }).click()
  await page.getByRole('option', { name: /^Middle Class/i }).click()

  await expect(page.getByText(/9 of 44 selected/i)).toBeVisible()
  await expect(preview).toContainText(/thai consonants writing practice/i)

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: /download pdf/i }).click()

  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe('thai-script-practice.pdf')
  await expect(
    page.getByRole('button', { name: /download pdf/i }),
  ).toBeEnabled()
})
