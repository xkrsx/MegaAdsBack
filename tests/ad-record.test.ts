import {AdRecord} from "../records/ad.record"

const defaultObject = {
    name: 'Test Name',
    description: 'blah',
    price: 10,
    url: "https://onet.pl/",
    lat: 9,
    lon: 9,
};

test('Can build AdRecord', () => {
    const ad = new AdRecord(defaultObject);
    expect(ad.name).toBe('Test Name');
    expect(ad.description).toBe('blah');
    expect(ad.price).toBe(10);
    expect(ad.url).toBe('https://onet.pl/');
    expect(ad.lat).toBe(9);
    expect(ad.lon).toBe(9);
});

test('Validates invalid price', () => {
    expect(() => new AdRecord({
        ...defaultObject,
        price: -3,
    })).toThrow('Cena nie może być mniejsza niż 0, ani przekraczać 9 999 999')
});

//@TODO: Check all the validations
