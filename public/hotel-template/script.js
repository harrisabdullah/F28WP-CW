/// Waits for the entire HTML document to be loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // Gets references to the HTML elements we need
    const searchForm = document.getElementById('search-form');
    const resultsContainer = document.getElementById('results-grid');

    // Adds an event listener for the form's 'submit' event
    searchForm.addEventListener('submit', (event) => {
        // Prevents the form from doing its default behavior (refreshing the page)
        event.preventDefault();

        // 1. Gets the values from the form inputs
        const destination = document.getElementById('destination').value;
        const checkIn = document.getElementById('check-in').value;
        const checkOut = document.getElementById('check-out').value;
        const guests = document.getElementById('guests').value;

        console.log('Search criteria:', {
            destination,
            checkIn,
            checkOut,
            guests
        });

       
        resultsContainer.innerHTML = `
            <article class="hotel-card">
                <h3>Test Hotel in ${destination}</h3>
                <p>Check-in: ${checkIn}</p>
                <p>Guests: ${guests}</p>
            </article>
        `;

    });

    // 4. A function to display the results (we'll use this with our API)
    function displayResults(hotels) {
        // Clears any previous results
        resultsContainer.innerHTML = '';

        if (hotels.length === 0) {
            resultsContainer.innerHTML = '<p>No hotels found matching your criteria.</p>';
            return;
        }

        // Loops through each hotel in the results and creates an HTML card for it
        hotels.forEach(hotel => {
            const hotelCard = document.createElement('article');
            hotelCard.className = 'hotel-card'; // Adds a class for styling
            
            hotelCard.innerHTML = `
                <img src="${hotel.imageUrl}" alt="${hotel.name}">
                <h3>${hotel.name}</h3>
                <p>${hotel.location}</p>
                <p><strong>£${hotel.pricePerNight}</strong> / night</p>
            `;
            
            resultsContainer.appendChild(hotelCard);
        });
    }

});
