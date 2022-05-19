"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CargoOrderSchema = new mongoose_1.Schema({
    extOrderId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    cargoType: {
        type: String,
        required: true
    },
    cargoAmount: {
        type: Number,
        required: true
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('CargoOrder', CargoOrderSchema);
//# sourceMappingURL=CargoOrder.js.map