const { is } = require("express/lib/request");

function isInt(n) {
    return typeof n === 'number' && Number.isInteger(n);
}

function isFloat(n) {
    return typeof n === 'number' && !Number.isInteger(n);
}

function isIntOverEqualZero(n){
    return isInt(n) && n >= 0;
}

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

const roomConfigSchema = {
    'single': isIntOverEqualZero,
    'double': isIntOverEqualZero,
    'twin': isIntOverEqualZero,
    'penthouse': isIntOverEqualZero,
}

const querySchema = {
    'name': val =>        typeof val === 'string',
    'min_price': val =>   isFloat(val) && val >= 0.0,
    'max_price': val =>   isFloat(val) && val >= 0.0,
    'start_date': val =>  typeof val === 'string' && isValidDateInFuture(val),
    'end_date': val =>    typeof val === 'string' && isValidDateInFuture(val),
    'room_config': val => typeof val === 'object'
}

function testSchema(schema, obj, strict){
    if (strict){
        return Object.entries(obj).every(([key, value]) => 
                schema[key]? schema[key](value) : false);
    }
    return Object.entries(obj).every(([key, value]) => 
            schema[key]? schema[key](value) : true);
}

function isValidQuery(q) {
    if (!testSchema(querySchema, q, false)){
        return false;
    }
    if ((q.max_price || q.min_price) && !q.room_config){
        return false;
    }
    const startDate = new Date(q.start_date);
    const endDate = new Date(q.end_date);
    if (startDate >= endDate){
        return false;
    }
    return q.room_config? 
           testSchema(roomConfigSchema, q.room_config, true) :
           true;
}

function daysBetween(date1, date2){
    let d1 = new Date(date1);
    let d2 = new Date(date2);
    let msInDay = 1000 * 60 * 60 * 24;
    return Math.floor((d2-d1) / msInDay); 
}

function search(db, req, res) {
    const query = req.body;
    if (!isValidQuery(query)){
        res.status(400).send('Bad Request');
    }
    
    const conditions = [];
    const params = [];
    if (query.name){
        conditions.push('name = ?');
        params.push(query.name);
    }
    if (query.min_price || query.max_price){
        let daysCount = daysBetween(query.start_date, query.end_date);
        const price = "((singleRoomPrice * ? + twinRoomPrice * ? + doubleRoomPrice * ?) * ?)"
        const price_conds = [q.room_config.single, q.room_config.twin, q.roomConfig.double, daysCount]
        if (query.min_price){
            conditions.push(price + " > ?");
            params += price_conds;
            params.push(query.min_price);
        }
        if (query.max_price){
            conditions.push(price + " < ?");
            params += price_conds;
            params.push(query.max_price);
        }
    }
    let sql = "SELECT * FROM hotels";
    if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).send('DB lookup failed')
            return
        }
        res.json(rows);
    });
}

module.exports =  search;
