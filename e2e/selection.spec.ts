import { expect, test } from '@playwright/test'

test('consonant presets can be applied and cleared from the browser flow', async ({
  page,
}) => {
  await page.goto('/')

  const preview = page.getByRole('region', { name: /preview/i })
  const presetButton = page.getByRole('button', { name: /consonant presets/i })

  await presetButton.click()
  await page.getByRole('option', { name: /^Middle Class/i }).click()

  await expect(presetButton).toContainText(/middle class/i)
  await expect(page.getByText(/9 of 44 selected/i)).toBeVisible()
  await expect(preview).toContainText(/thai consonants writing practice/i)

  await presetButton.click()
  await page.getByRole('option', { name: /^Middle Class/i }).click()

  await expect(presetButton).toContainText(/presets/i)
  await expect(page.getByText(/0 of 44 selected/i)).toBeVisible()
  await expect(preview).toContainText(
    /select consonants or vowels to see preview/i,
  )
})

test('vowel presets can be applied and cleared from the browser flow', async ({
  page,
}) => {
  await page.goto('/')

  const preview = page.getByRole('region', { name: /preview/i })
  const presetButton = page.getByRole('button', { name: /vowel presets/i })

  await presetButton.click()
  await page.getByRole('option', { name: /^Short Vowels/i }).click()

  await expect(presetButton).toContainText(/short vowels/i)
  await expect(page.getByText(/12 of 28 selected/i)).toBeVisible()
  await expect(preview).toContainText(/thai vowels writing practice/i)

  await presetButton.click()
  await page.getByRole('option', { name: /^Short Vowels/i }).click()

  await expect(presetButton).toContainText(/presets/i)
  await expect(page.getByText(/0 of 28 selected/i)).toBeVisible()
  await expect(preview).toContainText(
    /select consonants or vowels to see preview/i,
  )
})

test('manual character selection updates preview content', async ({ page }) => {
  await page.goto('/')

  const preview = page.getByRole('region', { name: /preview/i })

  await page.getByRole('button', { name: /ก\s*ไก่/i }).click()
  await expect(preview).toContainText(/thai consonants writing practice/i)
  await expect(preview).toContainText(/กอ ไก่/i)

  await page.getByRole('button', { name: /^อะ$/i }).click()
  await expect(preview).toContainText(/thai characters writing practice/i)
  await expect(preview).toContainText(/2 characters/i)

  await page.getByRole('button', { name: /ก\s*ไก่/i }).click()
  await page.getByRole('button', { name: /^อะ$/i }).click()
  await expect(preview).toContainText(
    /select consonants or vowels to see preview/i,
  )
})
