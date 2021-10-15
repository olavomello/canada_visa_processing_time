"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
if (process.env.NODE_ENV != 'production')
    require('dotenv-safe').config({ silent: true });
const express_1 = __importDefault(require("express"));
const https_1 = __importDefault(require("https"));
const cors_1 = __importDefault(require("cors"));
// DB connection
const database_1 = require("./database");
// Start server
const app = express_1.default();
const port = (process.env.PORT || 3001);
// Receive JSON
app.use(express_1.default.json());
// Cors options for cors midddleware
// List of allowed origins
const allowedOrigins = ['http://localhost:' + port, 'https://localhost:' + port, "https://canada-visa-processing-time.vercel.app:" + port, "https://canada-visa-processing-time.vercel.app", "https://canada-visa-processing-time.herokuapp.com", "*"];
// Cor options
const corsOptions = {
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'X-Access-Token',
    ],
    origin: allowedOrigins,
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,POST,DELETE',
    preflightContinue: false,
};
// Server options ***
// Cors pre-flight  
app.use(cors_1.default(corsOptions));
// Routes ---------
app.get('/get', (req, res) => {
    // URL
    const URL = "https://www.canada.ca/content/dam/ircc/documents/json/data-ptime-en.json";
    // Get JSON data
    https_1.default.get(URL, (urlRes) => {
        // Body
        let body = '';
        // Read data
        urlRes.on('data', (chunk) => (body += chunk.toString()));
        // On error
        urlRes.on('error', (err) => res.send("Request failed"));
        // On end
        urlRes.on('end', () => {
            if (urlRes.statusCode >= 200 && urlRes.statusCode <= 299) {
                // Ok
                let jsonData = JSON.parse(body);
                // Find Visa BR on types
                const VOC = jsonData["visitor-outside-canada"]["BR"];
                const SUP = jsonData["supervisa"]["BR"];
                const STD = jsonData["study"]["BR"];
                const WOR = jsonData["work"]["BR"];
                const CHD = jsonData["child_dependent"]["BR"];
                const CHA = jsonData["child_adopted"]["BR"];
                const REG = jsonData["refugees_gov"]["BR"];
                const REP = jsonData["refugees_private"]["BR"];
                // Send BR data   
                res.send({ VOC, SUP, STD, WOR, CHD, CHA, REG, REP });
                // Save data chart
                database_1.connAdd({
                    VOC,
                    SUP,
                    STD,
                    WOR,
                    CHD,
                    CHA,
                    REG,
                    REP,
                    creatAt: new Date()
                })
                    .then((response) => {
                    // Ok 
                })
                    .catch((error) => {
                    console.error("connAdd error : ", error);
                });
            }
            else {
                // Error
                return res.send("Request failed. status: " + urlRes.statusCode);
            }
        });
    });
});
// Index ---------
app.get('/', function (req, res) {
    // Return HTML
    res.sendFile('public_html/index.html', { root: __dirname });
});
// Start server
app.listen(port).setTimeout(10000); // Timeout msecs;
// Started
console.log("Server listen on port", port);
