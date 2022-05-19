"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ToOrderSchema = new mongoose_1.Schema({
    extOrderId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    toLocation: {
        type: String,
        required: true
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('ToOrder', ToOrderSchema);
//# sourceMappingURL=ToOrder.js.map