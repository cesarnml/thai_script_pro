import { expect, test } from '@playwright/test'

test('desktop flow updates preview and downloads a pdf', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: /thai worksheet generator/i })).toBeVisible()
  await expect(page.getByRole('region', { name: /preview/i })).toContainText(
    /select consonants or vowels to see preview/i
  )

  await page.getByRole('button', { name: /consonant presets/i }).click()
  await page.getByRole('option', { name: /^Middle Class/i }).click()

  await expect(page.getByRole('region', { name: /preview/i })).not.toContainText(
    /select consonants or vowels to see preview/i
  )
  await expect(page.getByRole('region', { name: /preview/i })).toContainText(
    /thai consonants writing practice/i
  )

  await page.getByLabel(/font size/i).selectOption('small')
  await page.getByLabel(/^columns$/i).selectOption('12')
  await page.getByLabel(/font size/i).selectOption('large')

  await expect(page.getByLabel(/^columns$/i)).toHaveValue('7')
  await expect(page.getByRole('status').filter({
    hasText: /adjusted to 7 columns so it fits on the page/i,
  })).toContainText(
    /adjusted to 7 columns so it fits on the page/i
  )

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: /download pdf/i }).click()
  const download = await downloadPromise

  expect(download.suggestedFilename()).toBe('thai-script-practice.pdf')
})

test.describe('responsive smoke', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('mobile viewport keeps the main flow usable', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('button', { name: /vowel presets/i }).click()
    await page.getByRole('option', { name: /^Short Vowels/i }).click()

    await expect(page.getByRole('region', { name: /preview/i })).toContainText(
      /thai vowels writing practice/i
    )
    await expect(page.getByRole('button', { name: /download pdf/i })).toBeVisible()
    await expect(page.getByText(/scroll sideways to view all columns/i)).toHaveCount(0)
  })
})
