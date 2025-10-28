CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
);

CREATE TABLE IF NOT EXISTS Hotels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    city TEXT,
    country TEXT,
    single_room_price REAL,
    twin_room_price REAL,
    double_room_price REAL
);

CREATE TABLE IF NOT EXISTS Bookings (
    user_id INTEGER REFERENCES Users(id),
    hotel_id INTEGER REFERENCES Hotels(id),
    start_date DATE,
    end_date DATE,
    room_type TEXT
);

