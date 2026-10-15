import { test, expect } from '@playwright/test';
import { fetchNextData, openSearchSession } from '../../helpers/api/page-data';

test.describe('Negative API', () => {
    test('NEG: unknown yard slug has no yard payload', async ({ browser }) => {
        const { url, data } = await fetchNextData(browser, '/lp/not-a-real-yard-xyz');
        expect(url).toMatch(/\/not-found$/);
        expect(data.page).toBe('/not-found');
        expect(data.props.pageProps.yardDetails).toBeUndefined();
        expect(data.props.pageProps.itemsInYard).toBeUndefined();
    });

    test('NEG: nonsense search text has no real matches', async ({ browser }) => {
        const term = 'zzqqxxnotarealthing123';
        const page = await openSearchSession(browser);
        const res = await page.request.post('/api/search', {
            data: { freeText: term, from: 0, size: 60 },
        });
        const body = await res.json();
        await page.close();

        expect(res.status()).toBe(200);
        expect(body.results.fallbackApplied).toBe(true);
        for (const r of body.results.records) {
            expect(r.assetDescription.toLowerCase()).not.toContain(term);
        }
    });
});
