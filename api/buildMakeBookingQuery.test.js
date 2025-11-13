const buildMakeBookingQuery = require('./buildMakeBookingQuery');

test('basic sucsess', () => {
    let query = buildMakeBookingQuery({
        userID: 1,
        hotelID: 2,
        startDate: '3025-01-01',
        endDate: '3025-01-02',
        roomConfig: {
            single: 4,
            double: 5,
            twin: 6,
            penthouse: 7,
        }
    })
    expect(query[0]).toBe('INSERT INTO Bookings (user, hotel, startDate, endDate, singleCount, doubleCount, twinCount, penthouseCount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    expect(query[1]).toStrictEqual([1, 2, '3025-01-01', '3025-01-02', 4, 5, 6, 7]);
})
