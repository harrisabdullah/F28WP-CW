document.addEventListener('DOMContentLoaded', () => {
    const errorMessage = document.getElementById('error-message');

    // Get dynamic message from URL query param (e.g., ?msg=Error%20message)
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get('msg');

    if (msg) {
        errorMessage.textContent = decodeURIComponent(msg);
    }
});
