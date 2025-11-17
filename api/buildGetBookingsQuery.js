const { testSchema, _ } = require('./schema');

const getBookingSchema = {
    'userID': val => Number.isInteger(val)
}

function buildGetBookingsApi(body){
    if (!testSchema(getBookingSchema, body, true)){
        return -1;
    }
    const sql = "SELECT * FROM Bookings WHERE user = ?"
    return [sql, [body.userID]]
}

module.exports = buildGetBookingsApi
