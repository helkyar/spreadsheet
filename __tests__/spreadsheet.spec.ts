import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173/')
})

test.describe('Header', () => {
  test('test buttons with mouse', async ({ page }) => {
    await page.getByLabel('information').click()
    await expect(
      page.getByRole('heading', { name: 'Key bindings' })
    ).toBeVisible()
    await page.locator('#root-modal').getByRole('button', { name: 'x' }).click()
    await expect(page.getByRole('banner')).toBeVisible()
    await page.locator('label').getByRole('img').click()
    await page.getByLabel('download').click()
    await expect(
      page.getByRole('heading', { name: 'Download Current Sheet' })
    ).toBeVisible()
    await page.getByLabel('upload').click()
    await expect(
      page.getByRole('heading', { name: 'Upload Options' })
    ).toBeVisible()
    await page.locator('#root-modal').getByRole('button', { name: 'x' }).click()
    await expect(
      page.getByRole('heading', { name: 'Computed File' })
    ).toBeVisible()
    await page.getByLabel('toggle dark mode').click()
  })
  test('test buttons with keyboard', async ({ page }) => {
    await page.getByRole('banner').click()
    await page.locator('body').press('Tab')
    await page.getByLabel('information').press('Enter')
    await expect(
      page.getByRole('heading', { name: 'Key bindings' })
    ).toBeVisible()
    await page.getByLabel('information').press('Escape')
    await expect(
      page.getByRole('heading', { name: 'Computed File' })
    ).toBeVisible()
    await page.getByLabel('information').press('Tab')
    await page.getByLabel('upload').press('Enter')
    await expect(
      page.getByRole('heading', { name: 'Upload Options' })
    ).toBeVisible()
    await page.getByLabel('upload', { exact: true }).press('Tab')
    await page.getByLabel('download').press('Enter')
    await expect(
      page.getByRole('heading', { name: 'Download Current Sheet' })
    ).toBeVisible()
    await page.getByLabel('information').press('Escape')
    await expect(
      page.getByRole('heading', { name: 'Computed File' })
    ).toBeVisible()
    await page.getByLabel('download').press('Tab')
    await page.getByLabel('save').press('Enter')
    await page.getByLabel('save').press('Tab')
    await page.getByLabel('toggle dark mode').press('Enter')
  })
  //   test('test save to localstorage', async ({ page }) => {})
})

test.describe('Spreadsheet header mouse', () => {
  test('test edit selection', async ({ page }) => {
    //check selected column
    await page.getByRole('cell', { name: 'A' }).click()
    await page.locator('.cell-text').first().click()
    await page.locator('.cell-input').first().fill('c')
    await page.locator('.cell-input').first().press('Enter')
    await expect(page.locator('tbody')).toContainText('c')
    await page.locator('.cell-text').first().press('Backspace')
    // time out in one test
    // await expect(page.locator('tbody')).not.toContainText('c')
  })
})
test.describe('Spreadsheet contextual menu', () => {
  // test('test header contextual menu add/remove', () => {})
  test('test keyboard body contextual menu', async ({ page }) => {
    await page.getByRole('banner').click()
    await page.locator('body').press('ControlOrMeta+ArrowDown')
    await page.locator('.cell-input').first().fill('a')
    await page.locator('.cell-input').first().press('Enter')
    await page.locator('tr:nth-child(2) > td > .cell-input').first().fill('a')
    await page
      .locator('tr:nth-child(2) > td > .cell-input')
      .first()
      .press('Enter')
    await page.locator('tr:nth-child(3) > td > .cell-input').first().fill('a')
    await page
      .locator('tr:nth-child(3) > td > .cell-input')
      .first()
      .press('Shift+ArrowUp')
    await page.getByRole('cell', { name: 'a a' }).nth(1).press('Shift+ArrowUp')
    await expect(page.locator('tbody')).toContainText('a')
    await page.getByRole('cell', { name: 'a a' }).first().press('Shift+F10')
    await page.getByRole('button', { name: 'paste' }).press('Tab')
    await page.getByRole('button', { name: 'copy expression' }).press('Tab')
    await page.getByRole('button', { name: 'copy value' }).press('Tab')
    await page.getByRole('button', { name: 'cut expression' }).press('Enter')
    await expect(page.locator('tbody')).not.toContainText('a')
    await page.locator('td:nth-child(3) > .cell-input').first().click()
    await page
      .locator('td:nth-child(3) > .cell-input')
      .first()
      .press('ArrowDown')
    await page.locator('tr:nth-child(2) > td:nth-child(3)').press('Shift+F10')
    await page.getByRole('button', { name: 'paste' }).press('Enter')
    // permissions needed firefox works
    // await expect(page.locator('tbody')).toContainText('a')
  })
  test('test mouse body contextual menu', async ({ page }) => {
    await page.getByRole('cell', { name: 'A' }).click()
    await page.locator('.cell-text').first().click()
    await page.locator('.cell-input').first().fill('c')
    await page.locator('.cell-input').first().press('Enter')
    await expect(page.locator('tbody')).toContainText('c')
    await page.locator('.cell-text').first().click({
      button: 'right',
    })
    await page.getByRole('button', { name: 'cut expression' }).click()
    await expect(page.locator('tbody')).not.toContainText('c')
    await expect(page.locator('.cell-text').first()).toBeVisible()
    await page.locator('.cell-text').first().click({
      button: 'right',
    })
    await page.getByRole('button', { name: 'paste' }).click()
    // permissions needed firefox works
    // await expect(page.locator('tbody')).toContainText('c')
  })
})

test.describe('Tabs', () => {
  test('test buttons mouse', async ({ page }) => {
    await page.getByRole('button', { name: '+' }).click()
    await expect(page.getByRole('tab', { name: 'Sheet 2' })).toBeVisible()
    await page.getByRole('cell', { name: 'A' }).click()
    await page.locator('.cell-text').first().click()
    await page.locator('.cell-input').first().fill('c')
    await page.locator('.cell-input').first().press('Enter')
    await expect(page.locator('tbody')).toContainText('c')
    await page
      .locator('div')
      .filter({ hasText: /^Sheet 2x$/ })
      .getByRole('button')
      .click()
    await expect(page.locator('tbody')).not.toContainText('c')
  })
  test('test', async ({ page }) => {
    await page.locator('body').press('ControlOrMeta+ArrowDown')
    await page.locator('td').first().press('ControlOrMeta+ArrowDown')
    await page.getByRole('tab', { name: 'Sheet' }).press('Shift+Tab')
    await page.getByRole('button', { name: '+' }).press('Enter')
    await expect(page.getByRole('main')).toContainText('Sheet 2')
    await page
      .getByRole('tab', { name: 'Sheet 2' })
      .press('ControlOrMeta+ArrowUp')
    await page.locator('td').first().press('ArrowUp')
    await page.getByRole('cell', { name: 'A' }).press('Enter')
    await page.locator('.cell-input').first().fill('c')
    await page.locator('.cell-input').first().press('Enter')
    await expect(page.locator('tbody')).toContainText('c')
    await page.locator('td').first().press('ControlOrMeta+ArrowDown')
    await page.getByRole('tab', { name: 'Sheet 2' }).press('Shift+Tab')
    await page
      .locator('div')
      .filter({ hasText: /^Sheet 2x$/ })
      .getByRole('button')
      .press('Enter')
    await expect(page.locator('tbody')).not.toContainText('c')
    await expect(page.getByRole('main')).not.toContainText('Sheet 2')
  })
})
