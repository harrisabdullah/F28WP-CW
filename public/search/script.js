
document.addEventListener('DOMContentLoaded', () => {

    const searchForm = document.getElementById('search-form');
    const resultsContainer = document.getElementById('results-grid');
    const welcomeMessage = document.getElementById('welcome-message');
    const loginBtn = document.getElementById('login-btn');
    const signUpBtn = document.getElementById('sign-up-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const addRoomBtn = document.getElementById("addRoomBtn");
    if (addRoomBtn) {
        addRoomBtn.addEventListener("click", addRoomType);
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

    function getPrice(hotel, query, start, end) {
    const duration = daysBetween(start, end);

    const price =
        ((hotel.singleRoomPrice * query.single) +
        (hotel.doubleRoomPrice * query.double) +
        (hotel.twinRoomPrice * query.twin) +
        (hotel.penthousePrice * query.penthouse))
        * duration;

    return price;
    }
    

    
function clearCookie(name, path = '/', domain = '') {
    if (document.cookie.indexOf (name + "=") === -1) {
        console.log(`Cookie '$(name)' not found.`);
        return;
    }

      let expiry = new Date(0).toUTCString(); 

            // Construct the deletion string
            let cookieString = name + '=; expires=' + expiry;

            // Append optional path (required to match original cookie setting)
            if (path) {
                cookieString += '; path=' + path;
            }

            // Append optional domain (required to match original cookie setting)
            if (domain) {
                cookieString += '; domain=' + domain;
            }

            // Set the cookie, which triggers deletion
            document.cookie = cookieString;
            window.location.href = window.location.origin;   

            console.log(`Cookie '${name}' cleared using: ${cookieString}`);
                document.getElementById('setMsg').textContent = `Cookie cleared: ${name}`;

    }
        function checkLoginStatus() {
            const username = getCookie('username'); // Assumes 'username' cookie is set upon login
            
            if (username) {
                welcomeMessage.textContent = `Welcome, ${decodeURIComponent(username)}!`;
                document.getElementById("login-btn").style.display = 'none';
                document.getElementById("sign-up-btn").style.display = 'none';
                document.getElementById("logout-btn").style.display = 'inline-block';
                document.getElementById("bookings-btn").style.display = 'inline-block';
            } else {
                welcomeMessage.textContent = '';
                document.getElementById("login-btn").style.display = '';
                document.getElementById("sign-up-btn").style.display = '';
                document.getElementById("logout-btn").style.display = 'none';
                document.getElementById("bookings-btn").style.display = 'none';
            }
        }



        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Clear both cookies
            clearCookie('userID');
            clearCookie('username');
            
            // Update UI and redirect (or simply reload the page)
            location.reload(); 


        });

        checkLoginStatus();

         
        function addRoomType() {
                console.log("addRoomType triggered"); // <-- test

        const select = document.getElementById("roomTypeSelect");
        const container = document.getElementById("selectedRooms");
        const val = select.value;
        if (!val) return alert("Select a room type");

        if (document.getElementById("room-" + val.toLowerCase())) {
            return alert("You've already added this room");
        }

        const div = document.createElement("div");
        div.id = "room-" + val.toLowerCase();
        div.className = "room-entry";
        div.innerHTML = `<label>${val}</label>
                        <input type="number" min="1" value="1">`;

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener("click", () => div.remove());

        div.appendChild(removeBtn);
        container.appendChild(div);

        select.value = ""; 
    }

    searchForm.addEventListener('submit', async (event) => {

        event.preventDefault();

        const destination = document.getElementById('destination').value;
        const checkIn = document.getElementById('check-in').value;
        const checkOut = document.getElementById('check-out').value;
        const maxPrice = document.getElementById('max-price').value;
        const minPrice = document.getElementById('min-price').value;
        const roomConfig = {
            single: Number(document.querySelector('#room-single input')?.value) || 0,
            double: Number(document.querySelector('#room-double input')?.value) || 0,
            twin: Number(document.querySelector('#room-twin input')?.value) || 0,
            penthouse: Number(document.querySelector('#room-penthouse input')?.value) || 0
        };


        const requestBody = {
            name: "", 
            minPrice: Number(minPrice),
            maxPrice: Number(maxPrice),
            startDate: checkIn,
            endDate: checkOut,
            city: destination,
            roomConfig: roomConfig
        };
        console.log(requestBody)
        
        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }

        const hotels = await response.json();
        console.log("Received:", hotels);

        sessionStorage.setItem('startDate', checkIn);
        sessionStorage.setItem('endDate', checkOut);
        sessionStorage.setItem('maxPrice', maxPrice);
        sessionStorage.setItem('minPrice', minPrice);


        sessionStorage.setItem('single', roomConfig.single);
        sessionStorage.setItem('double', roomConfig.double);
        sessionStorage.setItem('twin', roomConfig.twin);
        sessionStorage.setItem('penthouse', roomConfig.penthouse);

        displayResults(hotels, roomConfig, checkIn, checkOut);

        } catch (error) {
            resultsContainer.innerHTML = `<p class="error">Something went wrong while searching.</p>`;
        }
    });

    function displayResults(hotels, roomConfig, start, end) {
        resultsContainer.innerHTML = '';

        if (!hotels || hotels.length === 0) {
            resultsContainer.innerHTML = '<p>No hotels found matching your criteria.</p>';
            return;
        }

        hotels.forEach(hotel => {
            const hotelCard = document.createElement('article');
            const price = getPrice(hotel, roomConfig, start, end);
            hotelCard.className = 'hotel-card';
            
            hotelCard.innerHTML = `
                <h3>${hotel.name}</h3>
                <p>£${price}</p>      
                <a href = "/hotels/${hotel.hotelID}"> Book Now </a>`;
            
            resultsContainer.appendChild(hotelCard);
        });
    }
});
