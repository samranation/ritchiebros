import { test, expect, Page } from '@playwright/test';
import { openSearchSession } from '../../helpers/api/page-data';

test.describe('A3: Edmonton inventory search', () => {
    let page: Page;
    let status: number;
    let contentType: string;
    let body: any;
    let records: any[];

    test.beforeAll(async ({ browser }) => {
        page = await openSearchSession(browser);
        const res = await page.request.post('/api/search', {
            data: { freeText: 'Edmonton', from: 0, size: 60 },
        });
        status = res.status();
        contentType = res.headers()['content-type'];
        body = await res.json();
        records = body.results?.records;
    });

    test.afterAll(async () => {
        await page.close();
    });

    test('A3.1 response is HTTP 200 and JSON', () => {
        expect(status).toBe(200);
        expect(contentType).toContain('application/json');
    });

    test('A3.2 total hit count is greater than 0', () => {
        const total = body.results.totalAmount;
        expect(typeof total).toBe('number');
        expect(total).toBeGreaterThan(0);
    });

    test('A3.3 first page has records, each with assetDescription', () => {
        expect(records.length).toBeGreaterThan(0);
        for (const record of records) {
            expect(record.assetDescription).toBeTruthy();
            expect(typeof record.assetDescription).toBe('string');
        }
    });

    test('A3.4 log total and first 5 titles', () => {
        const titles = records.slice(0, 5).map((r) => r.assetDescription);
        console.log('total:', body.results.totalAmount);
        console.log('first 5 titles:', titles);
        expect(titles.length).toBeGreaterThan(0);
    });

    test('NEG: Edmonton results are real matches, not a fallback list', () => {
        expect(body.results.fallbackApplied).toBe(false);
    });
});
