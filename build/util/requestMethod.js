"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestMethod = void 0;
const axios_1 = __importDefault(require("axios"));
const timeoutRequest = 1500;
const timeoutErrorMessage = "Seaber system doesn't response. Please fix the system before sending request again";
const finallyMessage = "Sent request to Seaber server";
const requestMethod = (baseUrl, data) => {
    return axios_1.default.post(baseUrl, data, { timeout: timeoutRequest, timeoutErrorMessage: timeoutErrorMessage })
        .catch((err) => { throw err; })
        .finally(() => console.log(finallyMessage));
};
exports.requestMethod = requestMethod;
exports.default = exports.requestMethod;
//# sourceMappingURL=requestMethod.js.map