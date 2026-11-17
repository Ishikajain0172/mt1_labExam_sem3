const http = require('http');
const fs = require('fs');
const path = require('path');

// In-memory array for vehicles
let vehicles = [
    { id: 1, vehicleName: "Hyundai Creta", vehicleNumber: "HR26AB1234", type: "SUV", price: 1500000 },
    { id: 2, vehicleName: "Honda City", vehicleNumber: "DL10CC5678", type: "Sedan", price: 1200000 },
    { id: 3, vehicleName: "Tata Nexon", vehicleNumber: "UP16XY9876", type: "SUV", price: 1300000 }
];

const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;

    // Route: GET /
    if (req.method === 'GET' && pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Welcome to the Vehicle Management Application (HTTP Module)</h1>');
    }
    // Route: GET /vehicles
    else if (req.method === 'GET' && pathname === '/vehicles') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(vehicles));
    }
    // Route: GET /about
    else if (req.method === 'GET' && pathname === '/about') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Application information: Built using Node.js HTTP and FS modules." }));
    }
    // Route: GET /info (Static file serving)
    else if (req.method === 'GET' && pathname === '/info') {
        const filePath = path.join(__dirname, 'public', 'info.html');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 - Internal Server Error: Could not read file');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }
    // Route: POST /add-vehicle
    else if (req.method === 'POST' && pathname === '/add-vehicle') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const newVehicle = JSON.parse(body);
                // Check required fields
                if (!newVehicle.id || !newVehicle.vehicleName || !newVehicle.vehicleNumber || !newVehicle.type || !newVehicle.price) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: "Missing required fields" }));
                    return;
                }
                vehicles.push(newVehicle);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Vehicle added successfully", vehicle: newVehicle }));
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Invalid JSON format" }));
            }
        });
    }
    // 404 Error Handling for invalid routes
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "404 - Route Not Found" }));
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`HTTP Server running at http://localhost:${PORT}`);
});