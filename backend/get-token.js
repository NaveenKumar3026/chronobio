const jwt = require("jsonwebtoken");
const http = require("http");

const token = jwt.sign({ id: 1, email: "x@test.com" }, "secretkey123", { expiresIn: "1h" });

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/insights',
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + token
    }
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        require('fs').writeFileSync('output.txt', `Status: ${res.statusCode}\nBody: ${data}`);
    });
});

req.on('error', (error) => { });
req.end();
