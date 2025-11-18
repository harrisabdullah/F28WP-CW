document.getElementById("login-form").addEventListener("submit", function (e) { 
    e.preventDefault();    

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        console.log(username);
        console.log(password);

    
    fetch(window.location.origin + "/api/login", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        
        body: JSON.stringify({
            username: username,
            password: password
        })

    })
    .then(res => res.json())
    .then(data => {
        console.log(data)

        if (data.userID) {
            document.cookie = `userID=${data.userID}; path =/; max age=86400`;

            document.cookie = `username=${encodeURIComponent(username)}; path =/; max-age=86400`;

            window.location.href = window.location.origin;   
        } else {
            passwordError.textContent = "Invalid username or password.";
        }
        
    })
    .catch(err => {
        console.log(err)
    })
});

