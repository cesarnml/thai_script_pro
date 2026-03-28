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

test('sheet options clamp the layout and surface feedback in browser flow', async ({
  page,
}) => {
  await page.goto('/')

  await page.getByRole('button', { name: /consonant presets/i }).click()
  await page.getByRole('option', { name: /^Middle Class/i }).click()

  await page.getByLabel(/font size/i).selectOption('small')
  await page.getByLabel(/^columns$/i).selectOption('12')
  await page.getByLabel(/^ghost copies$/i).selectOption('10')
  await page.getByLabel(/font size/i).selectOption('large')

  await expect(page.getByLabel(/^columns$/i)).toHaveValue('7')
  await expect(page.getByLabel(/^ghost copies$/i)).toHaveValue('7')
  await expect(
    page.getByRole('status').filter({
      hasText: /adjusted to 7 columns so it fits on the page/i,
    }),
  ).toContainText(/adjusted to 7 columns so it fits on the page/i)
})

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
