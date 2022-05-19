"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const integration_1 = __importDefault(require("./routers/integration"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = __importDefault(require("./util/config"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
//Connect to mongodb
mongoose_1.default.connect(config_1.default.MONGODB_URI)
    .then(() => {
    console.log('Connect to database successfully');
    console.log(`Database: ${config_1.default.MONGODB_URI}`);
})
    .catch(err => console.log(err));
// IF: Messages from the External System for the same order came in longer 1 day between each other
// or even never come. All these kind of orders will be deleted from database
setInterval(() => {
    // Each 24 hours, call the function that remove orders that might not contructed from database
}, 86400000 /*(1 day)*/);
// Routes
app.use('/api/integration', integration_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map