const buildMakeBookingQuery = require('./buildMakeBookingQuery');

const validBody = {
  userID: 1,
  hotelID: 2,
  startDate: '2999-01-01',
  endDate: '2999-01-02',
  roomConfig: {
    single: 1,
    double: 1,
    twin: 0,
    penthouse: 0
  }
};

test('basic sucsess', () => {
    let query = buildMakeBookingQuery(validBody);
    expect(query[0]).toBe('INSERT INTO Bookings (user, hotel, startDate, endDate, singleCount, doubleCount, twinCount, penthouseCount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    expect(query[1]).toStrictEqual([1, 2, '2999-01-01', '2999-01-02', 1, 1, 0, 0]);
})

test('fails when body is missing required key', () => {
  const bad = { ...validBody };
  delete bad.userID;
  expect(buildMakeBookingQuery(bad)).toBe(-1);
});

test('fails when userID is not an integer', () => {
  const bad = { ...validBody, userID: 'abc' };
  expect(buildMakeBookingQuery(bad)).toBe(-1);
});

test('fails when hotelID is not an integer', () => {
  const bad = { ...validBody, hotelID: 1.5 };
  expect(buildMakeBookingQuery(bad)).toBe(-1);
});

test('fails when startDate is invalid format', () => {
  const bad = { ...validBody, startDate: '01-01-2999' };
  expect(buildMakeBookingQuery(bad)).toBe(-1);
});

test('fails when endDate is invalid format', () => {
  const bad = { ...validBody, endDate: '2999/01/05' };
  expect(buildMakeBookingQuery(bad)).toBe(-1);
});

test('fails when startDate is not in future', () => {
  const today = new Date().toISOString().split('T')[0];
  const bad = { ...validBody, startDate: today };
  expect(buildMakeBookingQuery(bad)).toBe(-1);
});

test('fails when endDate is not in future', () => {
  const today = new Date().toISOString().split('T')[0];
  const bad = { ...validBody, endDate: today };
  expect(buildMakeBookingQuery(bad)).toBe(-1);
});

test('fails when startDate >= endDate', () => {
  const bad = { ...validBody, startDate: '2999-01-03', endDate: '2999-01-03' };
  expect(buildMakeBookingQuery(bad)).toBe(-1);
});

test('fails when roomConfig is missing a key', () => {
  const badRoom = { ...validBody.roomConfig };
  delete badRoom.single;
  const bad = { ...validBody, roomConfig: badRoom };
  expect(buildMakeBookingQuery(bad)).toBe(-1);
});

test('fails when roomConfig has negative value', () => {
  const bad = {
    ...validBody,
    roomConfig: { ...validBody.roomConfig, twin: -1 }
  };
  expect(buildMakeBookingQuery(bad)).toBe(-1);
});

test('fails when roomConfig value is not integer', () => {
  const bad = {
    ...validBody,
    roomConfig: { ...validBody.roomConfig, penthouse: 1.2 }
  };
  expect(buildMakeBookingQuery(bad)).toBe(-1);
});

test('fails when roomConfig has extra key', () => {
  const bad = {
    ...validBody,
    roomConfig: { ...validBody.roomConfig, extra: 5 }
  };
  expect(buildMakeBookingQuery(bad)).toBe(-1);
});
