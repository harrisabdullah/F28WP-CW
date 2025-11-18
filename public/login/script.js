
document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Keep this! It's important.

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const passwordError = document.getElementById("passwordError");


    if (!username || !password) {
        alert("Please enter both username and password.");
        return;
    }

    fetch("/api/login", { 
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
        if (!res.ok) {
            throw new Error('Login failed. Please check your credentials.');
        }
        return res.json();
    })
    .then(data => {
        console.log("Login successful, data received:", data);
        console.log("Raw response JSON:", data);

        if (data.userID) {
            document.cookie = `userID=${data.userID}; path=/; max-age=86400`; // 86400 seconds = 1 day
            console.log("Saved userID to cookie:", data.userID);

            document.cookie = `username=${encodeURIComponent(username)}; path =/; max-age=86400`;

            window.location.href = window.location.origin;   
        } else {
            passwordError.textContent = "Invalid username or password.";
        }
    })
    .catch(err => {
        console.error(err);
            passwordError.textContent = "Invalid username or password.";
    });
});
        // Display errors to the user
        console.error(err);
        alert(err.message); // Simple way to show the error to the user
    });
});
