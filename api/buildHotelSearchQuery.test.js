const search = require('./buildHotelSearchQuery');

test('blanck test', () => {
    let query = search({});
    expect(query[0]).toBe('SELECT * FROM hotels');
    expect(query[1]).toStrictEqual([]);
})

test('hotel name test', () => {
    let query = search({
        name: 'test'
    })
    expect(query[0]).toBe('SELECT * FROM hotels WHERE name = ?');
    expect(query[1]).toStrictEqual(['test']);
})

test('min price test', () => {
    let query = search({
        startDate: '3021-01-01',
        endDate: '3021-01-02',
        minPrice: 2.0,
        roomConfig: {
            single:    1,
            double:    0,
            twin:      0,
            penthouse: 0,
        }
    })
    expect(query[0]).toBe('SELECT * FROM hotels WHERE ((singleRoomPrice * ? + twinRoomPrice * ? + doubleRoomPrice * ? + penthousePrice * ?) * ?) > ?');
    expect(query[1]).toStrictEqual([1, 0, 0, 0, 1, 2.0]);
})

test('max price test', () => {
    let query = search({
        startDate: '3021-01-01',
        endDate: '3021-01-02',
        maxPrice: 2.0,
        roomConfig: {
            single:    1,
            double:    0,
            twin:      0,
            penthouse: 0,
        }
    })
    expect(query[0]).toBe('SELECT * FROM hotels WHERE ((singleRoomPrice * ? + twinRoomPrice * ? + doubleRoomPrice * ? + penthousePrice * ?) * ?) < ?');
    expect(query[1]).toStrictEqual([1, 0, 0, 0, 1, 2.0]);
})

test('min and max price test', () => {
    let query = search({
        startDate: '3021-01-01',
        endDate: '3021-01-02',
        minPrice: 1.0,
        maxPrice: 2.0,
        roomConfig: {
            single:    1,
            double:    0,
            twin:      0,
            penthouse: 0,
        }
    })
    expect(query[0]).toBe('SELECT * FROM hotels WHERE ((singleRoomPrice * ? + twinRoomPrice * ? + doubleRoomPrice * ? + penthousePrice * ?) * ?) > ? AND ((singleRoomPrice * ? + twinRoomPrice * ? + doubleRoomPrice * ? + penthousePrice * ?) * ?) < ?');
    expect(query[1]).toStrictEqual([1, 0, 0, 0, 1, 1.0, 1, 0, 0, 0, 1, 2.0]);
})

test('name, min and max price test', () => {
    let query = search({
        name: 'test',
        startDate: '3021-01-01',
        endDate: '3021-01-04',
        minPrice: 1.0,
        maxPrice: 2.0,
        roomConfig: {
            single:    1,
            twin:      2,
            double:    3,
            penthouse: 4,
        }
    })
    expect(query[0]).toBe('SELECT * FROM hotels WHERE name = ? AND ((singleRoomPrice * ? + twinRoomPrice * ? + doubleRoomPrice * ? + penthousePrice * ?) * ?) > ? AND ((singleRoomPrice * ? + twinRoomPrice * ? + doubleRoomPrice * ? + penthousePrice * ?) * ?) < ?');
    expect(query[1]).toStrictEqual(["test", 1, 2, 3, 4, 3, 1.0, 1, 2, 3, 4, 3, 2.0]);
})

test('invalid name test', () => {
    let query = search({
        name: 1
    })
    expect(query).toBe(-1);
})

test('invalid date test', () => {
    let query = search({
        startDate: '3021-1-1',
        endDate: '3021-01-02',
        minPrice: 2.0,
        roomConfig: {
            single:    1,
            double:    0,
            twin:      0,
            penthouse: 0,
        }
    })
    expect(query).toBe(-1);
})

test('past date test', () => {
    let query = search({
        startDate: '2000-01-01',
        endDate: '2000-01-02',
        minPrice: 2.0,
        roomConfig: {
            single:    1,
            double:    0,
            twin:      0,
            penthouse: 0,
        }
    })
    expect(query).toBe(-1);
})

test('invalid room test', () => {
    let query = search({
        startDate: '3021-01-01',
        endDate: '3021-01-02',
        minPrice: 2.0,
        roomConfig: {
            single:    1,
            double:    0,
            twin:      0,
            penthouse: 0,
            aaaa: 1,
        }
    })
    expect(query).toBe(-1);
})

test('missing room test', () => {
    let query = search({
        startDate: '3021-01-01',
        endDate: '3021-01-02',
        minPrice: 2.0,
    })
    expect(query).toBe(-1);
})

test('missing date test', () => {
    let query = search({
        startDate: '3021-01-01',
        minPrice: 2.0,
        roomConfig: {
            single:    1,
            double:    0,
            twin:      0,
            penthouse: 0,
            aaaa: 1,
        }
    })
    expect(query).toBe(-1);
})
