import { test, expect } from '@playwright/test';

test('User can purchase items', async ({ page }) => {

    await page.goto('http://localhost:5173/');


    await expect(page).toHaveTitle(/By Aleks Store/);



    await page.getByRole('banner').getByRole('link', { name: 'Войти' }).click();


    await page.getByRole('link', { name: 'Зарегистрироваться' }).first().click();


    const timestamp = Date.now();
    await page.getByLabel('Введите имя:').fill(`User ${timestamp}`);
    await page.getByLabel('Введите email:').fill(`user${timestamp}@test.com`);
    await page.getByLabel('Введите пароль:').fill('password123');
    await page.getByLabel('Подтвердите пароль:').fill('password123');


    page.on('dialog', dialog => dialog.accept());

    await page.getByRole('button', { name: 'Зарегистрироваться' }).click();


    await expect(page).toHaveURL('http://localhost:5173/');



    await page.locator('.catalog-item-link').first().click();


    await expect(page.locator('.product-title')).toBeVisible();
    await page.getByRole('button', { name: 'Добавить в корзину' }).click();


    await page.getByRole('link', { name: /Корзина/ }).click();


    await expect(page.locator('.cart-item')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Перейти к оформлению' })).toBeVisible();


    await page.getByRole('button', { name: 'Перейти к оформлению' }).click();


    await expect(page.getByRole('button', { name: 'Подтвердить заказ' })).toBeVisible();
    await page.getByRole('button', { name: 'Подтвердить заказ' }).click();


    await expect(page.getByText('✅ Заказ оформлен!')).toBeVisible();
    await expect(page.getByText('📱 Открыть в Telegram')).toBeVisible();
});
