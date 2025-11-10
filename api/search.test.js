const search = require('./search');

test('hotel name query', () => {
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
    console.log(query);
    expect(query[0]).toBe('SELECT * FROM hotels WHERE ((singleRoomPrice * ? + twinRoomPrice * ? + doubleRoomPrice * ? + penthousePrice * ?) * ?) > ?');
    expect(query[1]).toStrictEqual([1, 0, 0, 0, 1, 2.0]);
})
