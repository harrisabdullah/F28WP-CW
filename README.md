# Group 6 Coursework for F28WP (Web Programming)

## Project Setup

Follow these steps to set up and run the project:

1. Clone the repository:
   ```bash
   git clone https://github.com/harrisabdullah/F28WP-CW

2. Navigate into the project folder:

   ```bash
   cd F28WP-CW
   ```
3. Install project dependencies:

   ```bash
   npm install
   ```

## Running the Server

Start the development server with:

```bash
npm run dev
```

The server should now be running and ready for use.

## database structure

### users
userID: int
username: str
password: str

### hotels
hotelID: int
Name: str
City: str
Country: str

singleRoomPrice: float option
twinRoomPrice: float option
doubleRoomPrice: float option

### bookings
User: int
Hotel: int

startDate: date
endDate: date

roomType: str
