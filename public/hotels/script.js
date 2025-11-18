
function loadQuery() {
    function getFormattedDate(offsetDays = 0) {
        const date = new Date();
        date.setDate(date.getDate() + offsetDays);
        return date.toISOString().split('T')[0];
    }

    const defaults = {
        startDate: getFormattedDate(1), // tomorrow
        endDate: getFormattedDate(2),   // day after tomorrow
        single: '1',
        double: '0',
        twin: '0',
        penthouse: '0'
    };

    for (const key in defaults) {
        if (!sessionStorage.getItem(key)) {
            sessionStorage.setItem(key, defaults[key]);
        }
    }

    return {
        startDate: sessionStorage.getItem('startDate'),
        endDate: sessionStorage.getItem('endDate'),
        single: parseInt(sessionStorage.getItem('single'), 10),
        double: parseInt(sessionStorage.getItem('double'), 10),
        twin: parseInt(sessionStorage.getItem('twin'), 10),
        penthouse: parseInt(sessionStorage.getItem('penthouse'), 10)
    };
}

function getCookie(name) {
        return document.cookie
        .split("; ")
        .find(row => row.startsWith(name + "="))
        ?.split("=")[1];
}


function daysBetween(startStr, endStr) {
    const start = new Date(startStr);
    const end = new Date(endStr);

    const diffMs = end - start;
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

function getPrice(hotel, query) {
    const duration = daysBetween(query.startDate, query.endDate);

    const price =
        ((hotel.singleRoomPrice * query.single) +
        (hotel.doubleRoomPrice * query.double) +
        (hotel.twinRoomPrice * query.twin) +
        (hotel.penthousePrice * query.penthouse))
        * duration;

    return price;
}

function updateHTML(hotel, query, price) {
    document.getElementById('hotel-name').textContent = hotel.name;
    document.getElementById('hotel-location').textContent = `${hotel.city}, ${hotel.country}`;
    document.getElementById('hotel-stars').textContent = `${hotel.starRating} stars`;
    document.getElementById('hotel-image').src = hotel.image;

    document.getElementById('booking-start').textContent = `Start: ${query.startDate}`;
    document.getElementById('booking-end').textContent = `End: ${query.endDate}`;

    const nights = daysBetween(query.startDate, query.endDate);
    document.getElementById('booking-nights').textContent = `Nights: ${nights}`;

    document.getElementById('rooms-single').textContent = `Single rooms: ${query.single}`;
    document.getElementById('rooms-double').textContent = `Double rooms: ${query.double}`;
    document.getElementById('rooms-twin').textContent = `Twin rooms: ${query.twin}`;
    document.getElementById('rooms-penthouse').textContent = `Penthouse: ${query.penthouse}`;

    document.getElementById('total-price').textContent = `Total price: £${price}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const hotelID = Number(location.pathname.split('/').filter(Boolean).pop());
    if (!Number.isInteger(hotelID)){
        window.location.href = "/error";
    }
    const userID = Number(getCookie('userID'));
    if (!Number.isInteger(userID)){
        window.location.href = "/login";
    }
    fetch("/api/getHotel", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            hotelID: hotelID,
        })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Login failed. Please check your credentials.');
        }
        return res.json();
    })
    .then(hotel => {
        const query = loadQuery();
        const price = getPrice(hotel, query);
        updateHTML(hotel, query, price);

        document.getElementById("book-button").addEventListener("click", () => {
            fetch("/api/makeBooking",{
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userID: userID,
                    hotelID: hotelID,
                    startDate: query.startDate,
                    endDate: query.endDate,
                    roomConfig: {
                        single: query.single,
                        double: query.double,
                        twin: query.twin,
                        penthouse: query.penthouse
                    }
                })
            }).then(res => {
                if (!res.ok) {
                    throw new Error('Login failed. Please check your credentials.');
                }
                return res.json();
            }).then(data => {
                window.location.href = "/bookings";
            })
        })
    })
})