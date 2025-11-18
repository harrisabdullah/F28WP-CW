/// Waits for the entire HTML document to be loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // Gets references to the HTML elements we need
    const signUpForm = document.getElementById('signup-form');

   

    // Adds an event listener for the form's 'submit' event
    signUpForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // 1. Gets the values from the form inputs
        const usernameInput = document.getElementById('uname').value;
        const passwordInput = document.getElementById('pword').value;
        const confirmPassword = document.getElementById('confirm').value
        const message = document.getElementById('message')

        if (!usernameInput){ 
            message.textContent = "Please enter a username!"
            return;
         }
         if(passwordInput.length < 8 ){
            message.textContent = "Password should be at least 8 characters" 
            return; 
           } 
         if(passwordInput == confirmPassword){
            message.textContent = "Passwords match!"
         }
             if (passwordInput != confirmPassword){
                message.textContent = "Passwords do not match!"
                 return;
                 } 
                
        
          message.textContent = "Hold on tight!!";

        // 2. (For now) Log the data to the console to make sure it's working
        console.log('Search criteria:', {
            usernameInput,
            passwordInput,
            confirmPassword,

        });
        fetch(window.location.origin + "/api/signup", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            
            body: JSON.stringify({
                username: usernameInput,
                password: passwordInput
            })
    
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
    
            if (data.userID) {
                document.cookie = `userID=${data.userID}; path =/; max-age=86400`;
    
                console.log("saved userID into cookie", data.userID)

                document.cookie = `username = ${encodeURIComponent(usernameInput)}; path =/; max-age=86400`;

                window.location.href = window.location.origin;
            } else {
                message.textContent = "Signup denied"
            }
            
        })
        .catch(err => {
            console.log(err)
            message.textContent = "Something went wrong :< "
        })
      
        

    });


  

});