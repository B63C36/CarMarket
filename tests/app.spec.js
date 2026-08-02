const { test, expect } = require('@playwright/test');

// homepage
test('home page loads', async ({ page }) => {
  await page.goto('/frontend/home.html');
  await expect(page).toHaveTitle(/CarMarket Ireland/);
});

test('load listings button works', async ({ page }) => {
  await page.goto('/frontend/home.html');
  await page.click('button:has-text("Load Listings")');
  const container = page.locator('#listings-container');
  await expect(container).not.toHaveText('Click "Load Listings" to see cars.');
});

test('post car without login shows error', async ({ page }) => {
  await page.goto('/frontend/home.html');
  await page.fill('#make', 'Ford');
  await page.fill('#model', 'Fiesta');
  await page.fill('#year', '2008');
  await page.fill('#price', '200000');
  await page.fill('#mileage', '1300');
  await page.fill('#contact', 'test@test.com');
  await page.click('button:has-text("List My Car")');
  await expect(page.locator('#message')).toHaveText('You must be logged in to post a car.');
});

// register page
test('register page loads', async ({ page }) => {
  await page.goto('/frontend/register.html');
  await expect(page).toHaveTitle(/Register/);
});

test('register with empty fields shows error', async ({ page }) => {
  await page.goto('/frontend/register.html');
  await page.click('button');
  await expect(page.locator('#message')).toHaveText('Please fill in all fields.');
});

// login page
test('login page loads', async ({ page }) => {
  await page.goto('/frontend/login.html');
  await expect(page).toHaveTitle(/Login/);
});

test('login with empty fields shows error', async ({ page }) => {
  await page.goto('/frontend/login.html');
  await page.click('button');
  await expect(page.locator('#message')).toHaveText('Please fill in all fields.');
});

test('login with wrong password shows error', async ({ page }) => {
  await page.goto('/frontend/login.html');
  await page.fill('#email', 'wrong@test.com');
  await page.fill('#password', 'wrongpassword');
  await page.click('button');
  await expect(page.locator('#message')).toHaveText('Invalid email or password');
});

// valuation page
test('valuation page loads', async ({ page }) => {
  await page.goto('/frontend/valuate.html');
  await expect(page).toHaveTitle(/AI Car Valuation/);
});

test('valuation with empty fields shows error', async ({ page }) => {
  await page.goto('/frontend/valuate.html');
  await page.click('button:has-text("Get AI Estimate")');
  await expect(page.locator('#result')).toHaveText('Please fill in at least make, model and year.');
});

// car detail page
test('car detail page with no ID shows error', async ({ page }) => {
  await page.goto('/frontend/car.html');
  await expect(page.locator('#car-detail')).toHaveText('No car ID provided.');
});

// navigation bar
test('navigate to login from home', async ({ page }) => {
  await page.goto('/frontend/home.html');
  await page.click('a:has-text("Login")');
  await expect(page).toHaveURL(/login.html/);
});

test('navigate to register from home', async ({ page }) => {
  await page.goto('/frontend/home.html');
  await page.click('a:has-text("Register")');
  await expect(page).toHaveURL(/register.html/);
});

test('navigate to AI valuation from home', async ({ page }) => {
  await page.goto('/frontend/home.html');
  await page.click('a:has-text("AI Valuation")');
  await expect(page).toHaveURL(/valuate.html/);
});