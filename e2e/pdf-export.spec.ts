import { expect, test } from '@playwright/test'

test('pdf export shows progress and completes as a download', async ({
  page,
}) => {
  await page.route('**/fonts/*', async (route) => {
    await page.waitForTimeout(150)
    await route.continue()
  })

  await page.goto('/')
  await page.getByRole('button', { name: /consonant presets/i }).click()
  await page.getByRole('option', { name: /^Middle Class/i }).click()
  const exportStatus = page.locator(
    'section[aria-label="Output actions"] [role="status"]',
  )

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: /download pdf/i }).click()

  await expect(
    page.getByRole('button', {
      name: /preparing pdf|building \d+\/\d+|starting download/i,
    }),
  ).toBeDisabled()
  await expect(exportStatus).toContainText(
    /preparing your pdf|building your pdf pages|starting your pdf download/i,
  )

  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe('thai-script-practice.pdf')
  await expect(
    page.getByRole('button', { name: /download pdf/i }),
  ).toBeEnabled()
})

test('pdf export failure shows a user-facing error toast', async ({ page }) => {
  await page.route('**/fonts/*', async (route) => {
    await route.fulfill({
      status: 404,
      contentType: 'text/plain',
      body: 'missing font for test',
    })
  })

  await page.goto('/')
  await page.getByRole('button', { name: /consonant presets/i }).click()
  await page.getByRole('option', { name: /^Middle Class/i }).click()

  await page.getByRole('button', { name: /download pdf/i }).click()

  await expect(
    page.getByText(/pdf export failed\. please try again\./i),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: /download pdf/i }),
  ).toBeEnabled()
})
