"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const FromOrderSchema = new mongoose_1.Schema({
    extOrderId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    fromLocation: {
        type: String,
        required: true
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('FromOrder', FromOrderSchema);
//# sourceMappingURL=FromOrder.js.map