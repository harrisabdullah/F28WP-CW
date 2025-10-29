/// Wait for the entire HTML document to be loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // Get references to the HTML elements we need
    const searchForm = document.getElementById('search-form');
    const resultsContainer = document.getElementById('results-grid');

    // Add an event listener for the form's 'submit' event
    searchForm.addEventListener('submit', (event) => {
        // Prevent the form from doing its default behavior (refreshing the page)
        event.preventDefault();

        // 1. Get the values from the form inputs
        const destination = document.getElementById('destination').value;
        const checkIn = document.getElementById('check-in').value;
        const checkOut = document.getElementById('check-out').value;
        const guests = document.getElementById('guests').value;

        // 2. (For now) Log the data to the console to make sure it's working
        console.log('Search criteria:', {
            destination,
            checkIn,
            checkOut,
            guests
        });

        // 3. This is where you will call your API
        // Your group members working on the API will tell you how to
        // use 'fetch' to send this data and get results.
        
        // Example of what the API call might look like:
        /*
        fetch(`https://your-group-api.com/search?dest=${destination}&checkin=${checkIn}&checkout=${checkOut}`)
            .then(response => response.json())
            .then(data => {
                // 'data' is the list of hotels from the API
                displayResults(data);
            })
            .catch(error => {
                console.error('Error fetching search results:', error);
                resultsContainer.innerHTML = '<p>Sorry, something went wrong. Please try again.</p>';
            });
        */
        
        // For testing, you can add a fake result:
        resultsContainer.innerHTML = `
            <article class="hotel-card">
                <h3>Test Hotel in ${destination}</h3>
                <p>Check-in: ${checkIn}</p>
                <p>Guests: ${guests}</p>
            </article>
        `;

    });

    // 4. A function to display the results (you'll use this with your API)
    function displayResults(hotels) {
        // Clear any previous results
        resultsContainer.innerHTML = '';

        if (hotels.length === 0) {
            resultsContainer.innerHTML = '<p>No hotels found matching your criteria.</p>';
            return;
        }

        // Loop through each hotel in the results and create an HTML card for it
        hotels.forEach(hotel => {
            const hotelCard = document.createElement('article');
            hotelCard.className = 'hotel-card'; // Add a class for styling
            
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