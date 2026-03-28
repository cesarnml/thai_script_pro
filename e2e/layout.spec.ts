import { expect, test } from '@playwright/test'

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
