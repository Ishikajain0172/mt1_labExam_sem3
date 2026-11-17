const express = require('express');
const app = express();
const PORT = 4000;

// Middleware to parse JSON body
app.use(express.json());

// In-memory array containing initial vehicle records
let vehicles = [
    {
        "id": 1,
        "vehicleName": "Hyundai Creta",
        "vehicleNumber": "HR26AB1234",
        "type": "SUV",
        "price": 1500000
    },
    {
        "id": 2,
        "vehicleName": "Honda City",
        "vehicleNumber": "DL10CC5678",
        "type": "Sedan",
        "price": 1200000
    },
    {
        "id": 3,
        "vehicleName": "Tata Nexon",
        "vehicleNumber": "UP16XY9876",
        "type": "SUV",
        "price": 1300000
    }
];

// Helper validation function for POST/PUT
const validateVehicleData = (req, res, next) => {
    const { id, vehicleName, vehicleNumber, type, price } = req.body;
    if (!id || !vehicleName || !vehicleNumber || !type || price === undefined || typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ error: "Missing required fields or price is not a positive number." });
    }
    next();
};

// GET: Retrieve all vehicles
app.get('/vehicles', (req, res) => {
    res.status(200).json(vehicles);
});

// GET: Retrieve vehicle by ID
app.get('/vehicles/:id', (req, res) => {
    const vehicleId = parseInt(req.params.id);
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
    }
    res.status(200).json(vehicle);
});

// POST: Add a new vehicle
app.post('/vehicles', validateVehicleData, (req, res) => {
    const newVehicle = req.body;
    // Check if ID already exists
    if (vehicles.some(v => v.id === newVehicle.id)) {
        return res.status(400).json({ error: "Vehicle with this ID already exists." });
    }
    vehicles.push(newVehicle);
    res.status(201).json({
        message: "Vehicle added successfully",
        vehicle: newVehicle
    });
});

// PUT: Update vehicle details
app.put('/vehicles/:id', validateVehicleData, (req, res) => {
    const vehicleId = parseInt(req.params.id);
    const index = vehicles.findIndex(v => v.id === vehicleId);
    
    if (index === -1) {
        return res.status(404).json({ error: "Vehicle not found for update" });
    }

    vehicles[index] = { ...vehicles[index], ...req.body };
    res.status(200).json({
        message: "Vehicle updated successfully",
        vehicle: vehicles[index]
    });
});

// DELETE: Delete a vehicle
app.delete('/vehicles/:id', (req, res) => {
    const vehicleId = parseInt(req.params.id);
    const index = vehicles.findIndex(v => v.id === vehicleId);

    if (index === -1) {
        return res.status(404).json({ error: "Vehicle not found for deletion" });
    }

    const deletedVehicle = vehicles.splice(index, 1);
    res.status(200).json({
        message: "Vehicle deleted successfully",
        vehicle: deletedVehicle[0]
    });
});

// Handle Invalid Routes
app.use((req, res) => {
    res.status(404).json({ error: "Endpoint not found" });
});

app.listen(PORT, () => {
    console.log(`Express Server running at http://localhost:${PORT}`);
});