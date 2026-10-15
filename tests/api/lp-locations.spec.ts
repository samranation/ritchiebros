import {expect, test} from "@playwright/test";
import {fetchNextData} from "../../helpers/api/page-data";

test.describe('A1: /lp locations', () => {
    let yards: any[];

    test.beforeAll(async({ browser }) => {
        const { status, data } = await fetchNextData(browser, '/lp');
        expect(status).toBe(200);
        yards = data.props.pageProps.yards;
    });

    test('A1.1 payload is JSON and includes list of yards/locations', async() => {
        expect(Array.isArray(yards)).toBe(true);
        expect(yards.length).toBeGreaterThan(0);
    })

    test('A1.2 more than 60 locations', async () => {
        expect(yards.length).toBeGreaterThan(60);
    });

    test('A1.3 each location has a name and a country', () => {
        for (const y of yards) {
            expect(y.name, JSON.stringify(y)).toBeTruthy();
            expect(y.address?.country || y.address?.countryCode, y.name).toBeTruthy();
        }
    });

    test('A1.4 includes Edmonton (CAN) and Phoenix (USA)', () => {
        const edmonton = yards.find((yard) => yard.name === 'Edmonton');
        const phoenix = yards.find((yard) => yard.name === 'Phoenix');
        expect(edmonton?.address.countryCode).toBe('CAN');
        expect(edmonton?.address.country).toBe('Canada');
        expect(phoenix?.address.countryCode).toBe('USA');
        expect(phoenix?.address.country).toBe('United States');
    });

    test('A1.5 each location has a site type; satellite > 15, permanent > 25', () => {
        for (const yard of yards) {
            expect(['Satellite', 'Permanent'], yard.name).toContain(yard.type);
        }
        const satellite = yards.filter((yard) => yard.type === 'Satellite').length;
        const permanent = yards.filter((yard) => yard.type === 'Permanent').length;
        console.log({ satellite, permanent });
        expect(satellite).toBeGreaterThan(15);
        expect(permanent).toBeGreaterThan(25);
    });

    test('A1.6 more than 8 distinct countries, incl. United States and Canada', () => {
        const countries = new Set(yards.map((y) => y.address.country));
        console.log([...countries]);
        expect(countries.size).toBeGreaterThan(8);
        expect(countries).toContain('United States');
        expect(countries).toContain('Canada');
    });

    test('NEG: unknown site is not in the list', () => {
        expect(yards.find((yard) => yard.name === 'Atlantis')).toBeUndefined();
    });
})
