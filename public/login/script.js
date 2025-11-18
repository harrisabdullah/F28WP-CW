// File: login.js (or similar)

document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Keep this! It's important.

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Optional: Basic client-side validation
    if (!username || !password) {
        alert("Please enter both username and password.");
        return;
    }

    fetch("/api/login", { // No need for window.location.origin, relative paths work best.
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(res => {
        // Check if the response was successful (status code 200-299)
        if (!res.ok) {
            // If not, throw an error to be caught by the .catch block
            throw new Error('Login failed. Please check your credentials.');
        }
        return res.json();
    })
    .then(data => {
        console.log("Login successful, data received:", data);

        if (data.userID) {
            // Set the cookie
            document.cookie = `userID=${data.userID}; path=/; max-age=86400`; // 86400 seconds = 1 day
            console.log("Saved userID to cookie:", data.userID);

        } else {
            // Handle cases where the API gives a 200 OK but no userID
            throw new Error('Login response did not include a userID.');
        }
    })
    .catch(err => {
        // Display errors to the user
        console.error(err);
        alert(err.message); // Simple way to show the error to the user
    });
});