document.addEventListener('DOMContentLoaded', () => {


document.getElementById("loginForm").addEventListener("submit", function (e) {     

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
       
        message.textContent = "Login successful!";

        window.location.href = "search.html"; 
        
    });

});