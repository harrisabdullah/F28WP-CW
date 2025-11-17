/// Waits for the entire HTML document to be loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // Gets references to the HTML elements we need
    const signupForm = document.getElementById('signup-form');
   

    // Adds an event listener for the form's 'submit' event
    searchForm.addEventListener('submit', (event) => {
        // Prevents the form from doing its default behavior (refreshing the page)
        event.preventDefault();

        // 1. Gets the values from the form inputs
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
  

        // 2. (For now) Log the data to the console to make sure it's working
        console.log('Search criteria:', {
            username,
            password,
        });

        // 3. This is where we will call our API
        // Group members working on the API will advise how to
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
        
        // For testing, we can add a fake result:
        resultsContainer.innerHTML = `
            <article class= "hotel-card" >
                <h3> Test username ${username}</h3>
                <h4>Password: ${password}</p>
            </article>
        `;

    });

  

});