const { testSchema, roomConfigSchema } = require('./schema');

function isValidDateInFuture(str) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;
    const [year, month, day] = str.split('-').map(Number);
    const date = new Date(str);
    const now = new Date();
    return date.getFullYear() === year &&
           date.getMonth() + 1 === month &&
           date.getDate() === day &&
           date > now;
}

const makeBookingSchema = {
    'userID': val => Number.isInteger(val),
    'hotelID': val => Number.isInteger(val),
    'startDate': val => isValidDateInFuture(val),
    'endDate': val => isValidDateInFuture(val),
    'roomConfig': val => testSchema(roomConfigSchema, val, true)
}

function buildMakeBookingQuery(body){
    if (!testSchema(makeBookingSchema, body, true)){
        return -1;
    }

    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);
    if (startDate >= endDate){
        return -1;
    }

    const sql = 'INSERT INTO Bookings (user, hotel, startDate, endDate, singleCount, doubleCount, twinCount, penthouseCount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const args = [body.userID, 
                  body.hotelID, 
                  body.startDate, 
                  body.endDate, 
                  body.roomConfig.single, 
                  body.roomConfig.double, 
                  body.roomConfig.twin, 
                  body.roomConfig.penthouse]

    return [sql, args];
}

module.exports =  buildMakeBookingQuery;
