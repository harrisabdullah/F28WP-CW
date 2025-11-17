const buildCancelBookingQuery = require('./buildCancelBookingQuery');

test('returns correct SQL and params for valid input', () => {
    const body = { bookingID: 123, userID: 456 };
    const result = buildCancelBookingQuery(body);
    expect(result).toEqual(['DELETE FROM Bookings WHERE bookingID = ?', [123]]);
});

test('returns -1 for missing bookingID', () => {
    const body = { userID: 456 };
    const result = buildCancelBookingQuery(body);
    expect(result).toBe(-1);
});

test('returns -1 for missing userID', () => {
    const body = { bookingID: 123 };
    const result = buildCancelBookingQuery(body);
    expect(result).toBe(-1);
});

test('returns -1 for invalid bookingID type', () => {
    const body = { bookingID: '123', userID: 456 };
    const result = buildCancelBookingQuery(body);
    expect(result).toBe(-1);
});

test('returns -1 for invalid userID type', () => {
    const body = { bookingID: 123, userID: '456' };
    const result = buildCancelBookingQuery(body);
    expect(result).toBe(-1);
});

test('ignores extra fields and still returns correct SQL', () => {
    const body = { bookingID: 123, userID: 456, extra: 'ignored' };
    const result = buildCancelBookingQuery(body);
    expect(result).toBe(-1);
});
