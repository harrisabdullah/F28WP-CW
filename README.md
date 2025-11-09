# Group 6 Coursework for F28WP (Web Programming)

## Project Setup

Follow these steps to set up and run the project:

1. **Clone the repository:**

   ```bash
   git clone https://{ your token }github.com/harrisabdullah/F28WP-CW
   ```

2. **Navigate into the project folder:**

   ```bash
   cd F28WP-CW
   ```

3. **Install project dependencies:**

   ```bash
   npm install
   ```

## Running the Server

Start the development server with:

```bash
npm run dev
```

The server should now be running and ready for use.

---

## Contributing

### Where to Contribute

All work should be done within **this GitHub repository**:
[https://github.com/harrisabdullah/F28WP-CW](https://github.com/harrisabdullah/F28WP-CW)

Before making any changes, make sure you are working on your **own branch** (not `main`).

---

### Step-by-Step Guide

1. **Pull the latest version of the main branch:**

   ```bash
   git checkout main
   git pull
   ```

2. **Create your own branch:**
   Replace `your-branch-name` with something descriptive (e.g. `login-page`, `hotel-api`, `frontend-layout`).

   ```bash
   git checkout -b your-branch-name
   ```

3. **Make your changes and commit them:**

   ```bash
   git add .
   git commit -m "Describe your changes here"
   ```

4. **Push your branch to GitHub:**

   ```bash
   git push origin your-branch-name
   ```

---

### Switching Between Branches

To switch to another branch:

```bash
git checkout branch-name
```

To see all available branches:

```bash
git branch -a
```

Make sure you **commit or stash** your changes before switching branches, or Git will not allow you to switch.

---

### Merging Branches

Toward the end of the project, we will **merge everyone’s branches into `main`**.

Each person will create a **pull request (PR)** on GitHub to merge their branch into `main`.
We’ll review the changes together to avoid conflicts or overwriting each other’s work.

---

## Database Structure

### users

* `userID`: int
* `username`: str
* `password`: str

### hotels

* `hotelID`: int
* `Name`: str
* `City`: str
* `Country`: str
* `singleRoomPrice`: float (optional)
* `twinRoomPrice`: float (optional)
* `doubleRoomPrice`: float (optional)

### bookings

* `User`: int
* `Hotel`: int
* `startDate`: date
* `endDate`: date
* `roomType`: str


