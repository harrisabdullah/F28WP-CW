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

    // Function to fetch and display bookings with timeout
    async function fetchBookings() {

        try {
            const response = await fetch(window.location.origin + "/api/getBookings", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userID: parseInt(userID)
                })
            });
            if (!response.ok) throw new Error('Failed to fetch bookings');
            const bookings = await response.json();
            displayBookings(bookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            window.location.href = '/error?msg=Failed%20to%20load%20bookings.%20Please%20try%20again.';
        }
    }

    // Function to display bookings
    function displayBookings(bookings) {
        bookingsGrid.innerHTML = ''; // Clear previous content

        if (bookings.length === 0) {
            bookingsGrid.innerHTML = '<p>You have no bookings yet.</p>';
            return;
        }

        console.log('Bookings fetched:', bookings);
        bookings.forEach(booking => {
            const bookingCard = document.createElement('div');
            bookingCard.className = 'booking-card';

            bookingCard.innerHTML = `
                <img src="${booking.image}" alt="${booking.name}">
                <h3>${booking.name}</h3>
                <p>Dates: ${booking.startDate} to ${booking.endDate}</p>
                <p>Rooms: Single: ${booking.singleCount}, Double: ${booking.doubleCount}, Twin: ${booking.twinCount}, Penthouse: ${booking.penthouseCount}</p>
                <p>Price: £${booking.price}</p>
                <p>Contact: fakehotel@email.com (fake for demo)</p>
                <button class="cancel-button" data-booking-id="${booking.bookingID}">Cancel Booking</button>
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

    // Function to cancel a booking
    async function cancelBooking(bookingID) {
        try {
            const response = await fetch('api/cancelBooking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingID: parseInt(bookingID) })
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
            window.location.href = '/error?msg=Failed%20to%20cancel%20booking.%20Please%20try%20again.';
        }
    }

    // Initial fetch
    fetchBookings();
});