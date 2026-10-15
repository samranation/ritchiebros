import { test, expect } from '@playwright/test';
import { fetchNextData } from '../../helpers/api/page-data';

test.describe('A2: Edmonton yard page JSON', () => {
    let pageProps: any;

    test.beforeAll(async ({ browser }) => {
        const { status, data } = await fetchNextData(browser, '/lp/edmonton-ab');
        expect(status).toBe(200);
        pageProps = data.props.pageProps;
    });

    test('A2.1 payload is JSON with yard data', () => {
        expect(pageProps).toBeTruthy();
        expect(pageProps.yardDetails).toBeTruthy();
    });

    test('A2.2 yard name, address, phone and hours', () => {
        const yard = pageProps.yardDetails;
        expect(yard.name).toBe('Edmonton');
        expect(yard.address.addressLine1).toContain('1500 Sparrow Drive');
        expect(yard.address.city).toBe('Nisku');
        expect(yard.address.zipPostalCode).toBe('T9E 8H6');
        expect(yard.contactPhone).toBeTruthy();
        expect(yard.pickupHoursFrom).toMatch(/^\d{2}:\d{2}$/); // 2 digits : 2 digits
        expect(yard.pickupHoursTo).toMatch(/^\d{2}:\d{2}$/);
    });

    test('A2.3 upcoming events have dates and names', () => {
        const events: any[] = pageProps.upcomingEvents;
        expect(Array.isArray(events)).toBe(true);
        expect(events.length).toBeGreaterThanOrEqual(1);
        for (const event of events) {
            expect(event.event_advertised_name).toBeTruthy();
            expect(Date.parse(event.event_start_date_time)).not.toBeNaN();
            expect(Date.parse(event.event_end_date_time)).not.toBeNaN();
        }
        const localities = events.map((event) => event.event_locality);
        for(const locality of localities) {
            expect(locality).toMatch(/Edmonton|Nisku/i);
        }
    });

    test('A2.4 itemsInYard categories', () => {
        const groups: any[] = pageProps.itemsInYard;
        const categories = groups.flatMap((group) => group.categories);
        console.log('categories:', categories.length);

        expect(categories.length).toBeGreaterThan(5);
        for (const category of categories) {
            expect(category.categoryLocalized, JSON.stringify(category)).toBeTruthy();
            if (category.totalAssets !== undefined && category.totalAssets !== null) {
                expect(typeof category.totalAssets).toBe('number');
                expect(category.totalAssets).toBeGreaterThanOrEqual(0);
            }
        }
        const names = categories.map((category) => category.categoryLocalized.trim());
        expect(names).toContain('Excavators');
    });

    test('NEG: yardDetails is not another yard', async () => {
        expect(pageProps.yardDetails.name).not.toBe('Phoenix');
        expect(pageProps.yardDetails.address.countryCode).toBe('CAN');
    });

    test('NEG: event start is before event end', () => {
        for (const event of pageProps.upcomingEvents) {
            expect(Date.parse(event.event_start_date_time)).toBeLessThan(Date.parse(event.event_end_date_time));
        }
    });
});
