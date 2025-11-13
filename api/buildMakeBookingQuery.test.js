const buildMakeBookingQuery = require('./buildMakeBookingQuery');

test('basic sucsess', () => {
    let query = buildMakeBookingQuery({
        userID: 1,
        hotelID: 2,
        startDate: '3025-01-01',
        endDate: '3025-01-02',
        roomConfig: {
            single: 1,
            double: 0,
            twin: 0,
            penthouse: 0,
        }
    })
    expect(query[0]).toBe('INSERT INTO Bookings (user, hotel, startDate, endDate, roomType) VALUES (?, ?, ?, ?, ?)');
    expect(query[1]).toStrictEqual([1, 2, '3025-01-01', '3025-01-02', ]);
})
