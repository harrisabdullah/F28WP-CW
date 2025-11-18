document.addEventListener('DOMContentLoaded', () => {

    const searchForm = document.getElementById('search-form');
    const resultsContainer = document.getElementById('results-grid');

    searchForm.addEventListener('submit', async (event) => {

        event.preventDefault();

        const destination = document.getElementById('destination').value;
        const checkIn = document.getElementById('check-in').value;
        const checkOut = document.getElementById('check-out').value;
        const guests = Number(document.getElementById('guests').value);

        const roomConfig = {
            single: guests, 
            double: 0,
            twin: 0,
            penthouse: 0
        };

        const requestBody = {
            name: "", 
            minPrice: 0,
            maxPrice: 9999,
            startDate: checkIn,
            endDate: checkOut,
            city: destination,
            roomConfig: roomConfig
        };
        
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

        displayResults(hotels);

        } catch (error) {
            console.error("API Error:", error);
            resultsContainer.innerHTML = `<p class="error">Something went wrong while searching.</p>`;
        }
    });

    function displayResults(hotels) {
        resultsContainer.innerHTML = '';

        if (!hotels || hotels.length === 0) {
            resultsContainer.innerHTML = '<p>No hotels found matching your criteria.</p>';
            return;
        }

        hotels.forEach(hotel => {
            const hotelCard = document.createElement('article');
            hotelCard.className = 'hotel-card';
            
            hotelCard.innerHTML = `
                <img src="${hotel.image}" alt="${hotel.name}">
                <h3>${hotel.name}</h3>
                <p>${hotel.description}</p>            `;
            
            resultsContainer.appendChild(hotelCard);
        });
    }
});
