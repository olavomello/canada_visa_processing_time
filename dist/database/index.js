"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connSelect = exports.connAdd = exports.connEnd = exports.connStart = void 0;
// MongoDB connection
if (process.env.NODE_ENV != 'production')
    require('dotenv-safe').config({ silent: true });
const mongoose_1 = require("mongoose");
// Config
const HOST = (process.env.DB_HOST || '');
const NAME = (process.env.DB_NAME || '');
const USER = (process.env.DB_USER || '');
const PASS = (process.env.DB_PASS || '');
// Globals
var isConnected = false;
var connection = null;
// Models
const GraphSchema = new mongoose_1.Schema({
    VOC: { type: String },
    SUP: { type: String },
    STD: { type: String },
    WOR: { type: String },
    CHD: { type: String },
    CHA: { type: String },
    REG: { type: String },
    REP: { type: String },
    createAt: {
        type: Date,
        default: new Date()
    }
}, { collection: 'processing_time_brazil' });
const GraphData = mongoose_1.model('graph', GraphSchema);
// Function connection start
function connStart() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!HOST || !USER || !PASS) {
            console.warn("Connection config error !");
            return false;
        }
        // Connetion string
        const CONN_STRING = `mongodb+srv://${USER}:${PASS}@${HOST}/${NAME}?retryWrites=true&w=majority&ssl=true`;
        try {
            // Connect to MongoDB
            connection = yield mongoose_1.connect(CONN_STRING);
            // Connection success
            isConnected = true;
            // End Connection
            connEnd();
            return isConnected;
        }
        catch (error) {
            // Connection error
            console.warn("Connection error :", error);
            isConnected = false;
            // End Connection
            connEnd();
            return isConnected;
        }
    });
}
exports.connStart = connStart;
// Function connect end
function connEnd() {
    if (isConnected) {
        // Connected
    }
    return true;
}
exports.connEnd = connEnd;
// Function Add Data
function connAdd(dataValues) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check connection
        if (!isConnected)
            yield connStart();
        if (!isConnected) {
            // Connection error
            return false;
        }
        // No data sent 
        if (!dataValues)
            return false;
        // Model add
        const addData = new GraphData(dataValues);
        // Save
        addData.save((err, response) => {
            if (err) {
                // Error
                console.error(err);
                return false;
            }
            // Sucessfully
            return true;
        });
        // On await error
        return false;
    });
}
exports.connAdd = connAdd;
// Database select
function connSelect(filter = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        // Select all data 
        // Empty filter = all
        try {
            // Check connection
            if (!isConnected)
                yield connStart();
            if (!isConnected) {
                // Connection error
                return false;
            }
            const all = yield GraphData.find(filter);
            connEnd();
            // Return
            return all;
        }
        catch (error) {
            // error
            connEnd();
            return error;
        }
    });
}
exports.connSelect = connSelect;
