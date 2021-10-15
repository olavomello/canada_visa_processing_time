"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Model : Graph
const mongoose_1 = require("mongoose");
function GraphData() {
    // Schema
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
    return mongoose_1.model('graph', GraphSchema);
}
exports.default = GraphData;
