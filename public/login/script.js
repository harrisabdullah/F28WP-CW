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
    })
    .catch(err => {
        console.log(err)
    })
});

