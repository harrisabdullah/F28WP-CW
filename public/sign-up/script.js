/// Waits for the entire HTML document to be loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // Gets references to the HTML elements we need
    const signUpForm = document.getElementById('signup-form');

   

    // Adds an event listener for the form's 'submit' event
    signUpForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // 1. Gets the values from the form inputs
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
  

        // 2. (For now) Log the data to the console to make sure it's working
        console.log('Search criteria:', {
            username,
            password,
        });
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
    
                console.log("saved userID into cookie", data.userID)
            }
            
        })
        .catch(err => {
            console.log(err)
        })
      
        

    });


  

});