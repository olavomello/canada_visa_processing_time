"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// MongoDB connection
if (process.env.NODE_ENV != 'production')
    require('dotenv-safe').config({ silent: true });
const mongodb_1 = require("mongodb");
function DB() {
    // Config
    const HOST = process.env.DB_HOST || '';
    const USER = process.env.DB_USER || '';
    const PASS = process.env.DB_PASS || '';
    // Check 
    if (!(HOST && USER && PASS)) {
        // Config error
        console.warn('DB config error');
        return false;
    }
    // URL
    const uri = `mongodb+srv://${USER}:${PASS}@${HOST}/myFirstDatabase?retryWrites=true&w=majority`;
    const opts = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };
    const client = new mongodb_1.MongoClient(uri, opts);
    // Try to connect
    client.connect((err) => {
        // Get colletion
        const collection = client.db("test").collection("devices");
        // Trace error
        console.log(collection, err);
        // Close DB
        client.close();
    });
}
exports.default = DB;
