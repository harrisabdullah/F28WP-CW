document.addEventListener('DOMContentLoaded', () => {
    const bookingsGrid = document.getElementById('bookings-grid');

    // Helper to get cookie by name
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // Check for userID in cookies
    const userID = getCookie('userID');
    if (!userID) {
        console.warn('No userID found in cookies - redirecting to login');
        // Redirect to login if no userID
        window.location.href = '/login';
        return;
    }

function displayBookings(bookings) {
        bookingsGrid.innerHTML = ''; // Clear previous content

        if (bookings.length === 0) {
            bookingsGrid.innerHTML = '<p>You have no bookings yet.</p>';
            return;
        }

        bookings.forEach(booking => {
            const bookingCard = document.createElement('div');
            bookingCard.className = 'booking-card';
            bookingCard.innerHTML = `
            <h3>Booking #${booking.bookingID}</h3>
            <p><strong>Hotel ID:</strong> ${booking.hotelID}</p>
            <p><strong>Start Date:</strong> ${booking.startDate}</p>
            <p><strong>End Date:</strong> ${booking.endDate}</p>
            <p><strong>Rooms:</strong></p>
            <ul>
                <li>Single: ${booking.single}</li>
                <li>Double: ${booking.double}</li>
                <li>Twin: ${booking.twin}</li>
                <li>Penthouse: ${booking.penthouse}</li>
            </ul>
            <p><strong>Total Price:</strong> $${booking.price}</p>
        `;

            bookingsGrid.appendChild(bookingCard);
        });

        // Add event listeners for cancel buttons
        document.querySelectorAll('.cancel-button').forEach(button => {
            button.addEventListener('click', async (event) => {
                const bookingID = event.target.getAttribute('data-booking-id');
                await cancelBooking(bookingID);
            });
        });
    }


    // Function to fetch and display bookings with timeout
    async function fetchBookings() {
        try {
            const response = await fetch('/api/getBookings', {
                method: 'POST', // Changed to POST to support body
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userID: parseInt(userID)
                })
            });
            if (!response.ok){
                throw new Error('Failed to fetch bookings');
            }
            const bookings = await response.json();

            displayBookings(bookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            window.location.href = '/error?msg=Failed%20to%20load%20bookings.%20Please%20try%20again.';
        }
    }

    
    // Function to cancel a booking (now includes userID for authentication)
    async function cancelBooking(bookingID) {
        try {
            const response = await fetch('http://localhost:3000/cancel-booking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingID: parseInt(bookingID),
                    userID: parseInt(userID) // Added for authentication
                })
            });
            if (!response.ok) throw new Error('Failed to cancel booking');
            const result = await response.json();

            if (result.success) {
                alert('Booking cancelled successfully!');
                fetchBookings(); // Refresh the list
            } else {
                throw new Error('Cancellation failed');
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
            window.location.href = '/error?msg=Failed%20to%20cancel%20booking.%20Please%20verify%20your%20details%20and%20try%20again.';
        }
    }

    // Initial fetch
    fetchBookings();
});