CREATE TABLE IF NOT EXISTS Users (
    userID INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
);

CREATE TABLE IF NOT EXISTS Hotels (
    hotelID INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    city TEXT,
    singleRoomPrice REAL,
    twinRoomPrice REAL,
    doubleRoomPrice REAL,
    penthousePrice REAL,
    starRating INTEGER,
    image TEXT
);

CREATE TABLE IF NOT EXISTS Bookings (
    bookingID INTEGER PRIMARY KEY AUTOINCREMENT,
    user INTEGER REFERENCES Users(id),
    hotel INTEGER REFERENCES Hotels(id),
    startDate DATE,
    endDate DATE,
    singleCount INTEGER,
    doubleCount INTEGER,
    twinCount INTEGER,
    penthouseCount INTEGER
);

