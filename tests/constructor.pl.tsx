import path from 'path';
import { fileURLToPath } from 'url';

import { expect, test } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HAR_PATH = path.resolve(__dirname, 'hars/burger-api.har');
const BUN_NAME = 'Краторная булка N-200i';
const MAIN_NAME = 'Биокотлета из марсианской Магнолии';
const ORDER_NUMBER = '84512';

test.describe('конструктор бургера и оформление заказа', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(HAR_PATH, {
      url: /\/api\//,
      update: false,
    });
    await page.goto('/');
  });

  test('добавляет булку и начинку в конструктор', async ({ page }) => {
    await expect(page.getByText('Выберите булки').first()).toBeVisible();
    await expect(page.getByText('Выберите начинку')).toBeVisible();

    const bunItem = page.locator('li', { hasText: BUN_NAME });
    await bunItem.getByRole('button', { name: 'Добавить' }).click();

    const mainItem = page.locator('li', { hasText: MAIN_NAME });
    await mainItem.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByText(`${BUN_NAME} (верх)`)).toBeVisible();
    await expect(page.getByText(`${BUN_NAME} (низ)`)).toBeVisible();
    await expect(page.getByText('Выберите начинку')).not.toBeVisible();
    await expect(mainItem.getByText('1')).toBeVisible();
  });

  test('открывает модальное окно с данными выбранного ингредиента и закрывает по крестику и оверлею', async ({
    page,
  }) => {
    const modalsRoot = page.locator('#modals');
    const modalWindow = modalsRoot.locator('> div').first();
    const ingredientCard = page.locator('li a', { hasText: MAIN_NAME });

    await ingredientCard.click();

    await expect(modalWindow).toBeVisible();
    await expect(modalsRoot.getByText(MAIN_NAME)).toBeVisible();
    await expect(modalsRoot.getByText('4242')).toBeVisible();

    await modalsRoot.getByRole('button', { name: 'Закрыть' }).click();
    await expect(modalWindow).not.toBeVisible();
    await expect(modalsRoot.locator('> *')).toHaveCount(0);

    await ingredientCard.click();
    await expect(modalWindow).toBeVisible();
    await expect(modalsRoot.getByText(MAIN_NAME)).toBeVisible();

    const modalBox = await modalWindow.boundingBox();
    if (modalBox) {
      await page.mouse.click(10, 10);
    }
    await expect(modalWindow).not.toBeVisible();
    await expect(modalsRoot.locator('> *')).toHaveCount(0);
  });

  test('создает заказ с авторизацией, проверяет номер и очистку конструктора, затем закрывает модалку', async ({
    page,
    context,
  }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer fake-access-token',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.evaluate(() => {
      window.localStorage.setItem('refreshToken', 'fake-refresh-token');
    });

    await page.reload();

    const bunItem = page.locator('li', { hasText: BUN_NAME });
    await bunItem.getByRole('button', { name: 'Добавить' }).click();

    const mainItem = page.locator('li', { hasText: MAIN_NAME });
    await mainItem.getByRole('button', { name: 'Добавить' }).click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modalsRoot = page.locator('#modals');
    const modalWindow = modalsRoot.locator('> div').first();

    await expect(modalWindow).toBeVisible();
    await expect(modalsRoot.getByText(ORDER_NUMBER, { exact: true })).toBeVisible();

    await expect(page.getByText('Выберите булки').first()).toBeVisible();
    await expect(page.getByText('Выберите начинку')).toBeVisible();

    await modalsRoot.getByRole('button', { name: 'Закрыть' }).click();
    await expect(modalWindow).not.toBeVisible();
    await expect(modalsRoot.locator('> *')).toHaveCount(0);
  });
});