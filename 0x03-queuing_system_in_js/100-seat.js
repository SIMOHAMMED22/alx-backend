const express = require('express');
const { promisify } = require('util');
const redis = require('redis');
const kue = require('kue');

const app = express();
const port = 1245;

// Connect to Redis
const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// Create a Kue queue
const queue = kue.createQueue();

// Set the initial number of available seats and reservation status
let availableSeats = 50;
let reservationEnabled = true;

// Function to reserve seats
async function reserveSeat(number) {
    await setAsync('available_seats', number);
}

// Function to get current available seats
async function getCurrentAvailableSeats() {
    const seats = await getAsync('available_seats');
    return seats ? parseInt(seats) : 0;
}

// Route to get the number of available seats
app.get('/available_seats', async (req, res) => {
    const numberOfAvailableSeats = await getCurrentAvailableSeats();
    res.json({ numberOfAvailableSeats });
});

// Route to reserve a seat
app.get('/reserve_seat', async (req, res) => {
    if (!reservationEnabled) {
        return res.json({ "status": "Reservation are blocked" });
    }

    queue.create('reserve_seat', {}).save();

    res.json({ "status": "Reservation in process" });
});

// Route to process the queue and reserve seats
app.get('/process', async (req, res) => {
    res.json({ "status": "Queue processing" });

    queue.process('reserve_seat', async (job, done) => {
        const currentSeats = await getCurrentAvailableSeats();
        if (currentSeats === 0) {
            reservationEnabled = false;
            return done(new Error('Not enough seats available'));
        } else {
            await reserveSeat(currentSeats - 1);
            if (currentSeats === 1) {
                reservationEnabled = false;
            }
            console.log(`Seat reservation job ${job.id} completed`);
            done();
        }
    });
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
