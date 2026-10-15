import { Browser, Page } from '@playwright/test';

export async function fetchNextData(browser: Browser, path: string) {
    const page = await browser.newPage();
    try {
        const res = await page.goto(path);
        const raw = await page.locator('#__NEXT_DATA__').innerText();
        return { status: res?.status(), url: page.url(), data: JSON.parse(raw) };
    } finally {
        await page.close();
    }
}

export async function openSearchSession(browser: Browser): Promise<Page> {
    const page = await browser.newPage();
    await page.goto('/search?freeText=Edmonton');
    return page;
}
