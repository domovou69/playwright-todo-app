import { expect } from '@playwright/test'
import { test } from '../fixtures/fixtures'

const username = 'demo'
const password = 'password123'

test.describe('Filter Todos by Priority', () => {
  test.beforeEach(async ({ page, loginPage }) => {
    await page.goto('/')

    await loginPage.login(username, password)
    await expect(page).toHaveURL('/todos')
  })
  test('Filter by low priority', async ({ todosPage }) => {
    await todosPage.filters.selectPriority('Low')
    await expect(todosPage.todoItem.filter({ hasText: 'low' })).not.toBeVisible()
    await expect(todosPage.todoItem.filter({ hasText: 'medium' })).not.toBeVisible()
    await expect(todosPage.todoItem.filter({ hasText: 'high' })).not.toBeVisible()
  })

  test('Filter by medium priority', async ({ todosPage }) => {
    await todosPage.filters.selectPriority('Medium')
    await expect(todosPage.todoItem.filter({ hasText: 'low' })).toBeVisible()
    await expect(todosPage.todoItem.filter({ hasText: 'medium' })).toBeVisible()
    await expect(todosPage.todoItem.filter({ hasText: 'high' })).not.toBeVisible()
  })

  test('Filter by high priority', async ({ todosPage }) => {
    await todosPage.filters.selectPriority('High')
    await expect(todosPage.todoItem.filter({ hasText: 'low' })).not.toBeVisible()
    await expect(todosPage.todoItem.filter({ hasText: 'medium' })).not.toBeVisible()
    await expect(todosPage.todoItem.filter({ hasText: 'high' })).toBeVisible()
  })

  test('Clear priority filter', async ({ todosPage }) => {
    await todosPage.filters.selectPriority('Low')
    await expect(todosPage.todoItem.filter({ hasText: 'high' })).not.toBeVisible()
    await todosPage.filters.clearFilters()
    await expect(todosPage.todoItem.filter({ hasText: 'low' })).toBeVisible()
    await expect(todosPage.todoItem.filter({ hasText: 'medium' })).toBeVisible()
    await expect(todosPage.todoItem.filter({ hasText: 'high' })).toBeVisible()
  })
})
