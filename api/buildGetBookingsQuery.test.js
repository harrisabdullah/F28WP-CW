const buildGetBookingsQuery = require('./buildGetBookingsQuery');

test('returns SQL query and parameters for valid input', () => {
    const body = { userID: 123 };
    const result = buildGetBookingsQuery(body);
    expect(result).toEqual(["SELECT * FROM Bookings WHERE user = ?", [123]]);
});

test('returns -1 for invalid input', () => {
    const body = { userID: "not-a-number" };
    const result = buildGetBookingsQuery(body);
    expect(result).toBe(-1);
});

test('returns -1 when userID is missing', () => {
    const body = {};
    const result = buildGetBookingsQuery(body);
    expect(result).toBe(-1);
});
