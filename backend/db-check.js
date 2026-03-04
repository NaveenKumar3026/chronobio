const authService = require('../chronobio-ui/src/services/authService');
const jwt = require("jsonwebtoken");
const http = require("http");

const token = jwt.sign({ id: 1, email: "x@test.com" }, "secretkey123", { expiresIn: "1h" });

const postData = JSON.stringify({
    sleepTime: '22:00',
    wakeTime: '06:00',
    workStart: '09:00',
    workEnd: '17:00',
    energy: 8,
    focus: 9
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/log',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': 'Bearer ' + token
    }
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log(`Status: ${res.statusCode}\nBody: ${data}`);
    });
});

req.on('error', (error) => { console.error(error); });
req.write(postData);
req.end();
