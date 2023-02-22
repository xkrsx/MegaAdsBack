import {AdRecord} from "../records/ad.record";
import {pool} from "../utils/db";
import {AdEntity} from "../types";

const defaultObject = {
    name: '[TEST] Test Name',
    description: 'blah',
    price: 10,
    url: "https://onet.pl/",
    lat: 9,
    lon: 9,
};

afterAll(async () => {
    await pool.execute('DELETE FROM `ads` WHERE `name` LIKE "%[TEST]%"');
    await pool.end();
})

test('AdRecord returns data from database for one entry.', async () => {
    const ad = await AdRecord.getOne('abc');

    expect(ad).toBeDefined();
    expect(ad.id).toEqual('abc');
    expect(ad.name).toBe('testowy');
})

test('AdRecord.getOne returns null from database for unexisting entry.', async () => {
    const ad = await AdRecord.getOne('abcdefghizzzzz');

    expect(ad).toBeNull();
});

test('AdRecord.findAll returns array of found entries.', async () => {
    const ads = await AdRecord.findAll('');

    expect(ads).not.toEqual([]);
    expect(ads[0].id).toBeDefined();
});

test('AdRecord.findAll returns array of found entries when searching for "a".', async () => {
    const ads = await AdRecord.findAll('a');

    expect(ads).not.toEqual([]);
    expect(ads[0].id).toBeDefined();
});

test('AdRecord.findAll returns empty array of found entries when searching for something that does not exist.', async () => {
    const ads = await AdRecord.findAll('abdasdsadada');

    expect(ads).toEqual([]);
});

test('AdRecord.findAll returns smaller amount of data.', async () => {
    const ads = await AdRecord.findAll('');

    expect((ads[0] as AdEntity).price).toBeUndefined();
    expect((ads[0] as AdEntity).price).toBeUndefined();
    expect((ads[0] as AdEntity).url).toBeUndefined();
    expect((ads[0] as AdEntity).name).toBeUndefined();
    expect((ads[0] as AdEntity).description).toBeUndefined();
});

test('AdRecord.inserts returns new UUID.', async () => {
    const ad = new AdRecord(defaultObject);

    await ad.insert();

    expect(ad.id).toBeDefined();
    expect(typeof ad.id).toBe('string');

});

test('AdRecord.inserts inserts data to database.', async () => {
    const ad = new AdRecord(defaultObject);

    await ad.insert();

    const foundAd = await AdRecord.getOne(ad.id)

    expect(foundAd).toBeDefined();
    expect(foundAd).not.toBeNull();
    expect(foundAd.id).toBe(ad.id);

});

