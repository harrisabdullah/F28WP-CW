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
            const response = await fetch(window.location.origin + "http://localhost:3000/bookings/", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userID: parseInt(userID)
                })
            });
            if (!response.ok){
                console.log(userID);
                throw new Error('Failed to fetch bookings');
            }
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

            // Assuming `bookings` is the array fetched from the backend
bookings.forEach(booking => {
    const bookingCard = document.createElement('div');
    bookingCard.classList.add('booking-card');

    // Parse and map raw data to expected keys
    const parsedBooking = {
        image: 'images/hotel-default.jpg', // Replace with actual image logic if available
        name: `Hotel ${booking.hotelID}`,  // You can customize this further
        startDate: booking.startDate,
        endDate: booking.endDate,
        singleCount: booking.single,
        doubleCount: booking.double,
        twinCount: booking.twin,
        penthouseCount: booking.penthouse,
        price: booking.price,
        bookingID: booking.bookingID
    };

    // Inject parsed data into HTML
    bookingCard.innerHTML = `
        <img src="${parsedBooking.image}" alt="${parsedBooking.name}">
        <h3>${parsedBooking.name}</h3>
        <p>Dates: ${parsedBooking.startDate} to ${parsedBooking.endDate}</p>
        <p>Rooms: Single: ${parsedBooking.singleCount}, Double: ${parsedBooking.doubleCount}, Twin: ${parsedBooking.twinCount}, Penthouse: ${parsedBooking.penthouseCount}</p>
        <p>Price: £${parsedBooking.price}</p>
        <p>Contact: fakehotel@email.com (fake for demo)</p>
        <button class="cancel-button" data-booking-id="${parsedBooking.bookingID}">Cancel Booking</button>
    `;

    document.querySelector('#bookings-container').appendChild(bookingCard);
});
        });

        // Add event listeners for cancel buttons
        document.querySelectorAll('.cancel-button').forEach(button => {
            button.addEventListener('click', async (event) => {
                const bookingID = event.target.getAttribute('data-booking-id');
                await cancelBooking(bookingID);
            });
        });
    }

 
    // Function to cancel a booking (now includes userID for authentication)
    async function cancelBooking(bookingID) {
        try {
            const response = await fetch('http://localhost:3000/booking/', {
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