
function buildMakeBookingQuery(body){
    // TODO: validation

    const sql = 'INSERT INTO Bookings (user, hotel, startDate, endDate, singleCount, doubleCount, twinCount, penthouseCount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const args = [body.userID, 
                  body.hotelID, 
                  body.startDate, 
                  body.endDate, 
                  body.roomConfig.single, 
                  body.roomConfig.double, 
                  body.roomConfig.twin, body.roomConfig.penthouse]

    return [sql, args];
}

module.exports =  buildMakeBookingQuery;
