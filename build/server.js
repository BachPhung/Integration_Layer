"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const http_1 = __importDefault(require("http"));
const config_1 = __importDefault(require("./util/config"));
const server = http_1.default.createServer(app_1.default);
const PORT = config_1.default.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
//# sourceMappingURL=server.js.map