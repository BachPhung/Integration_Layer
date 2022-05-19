"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const integration_1 = require("../controller/integration");
const router = express_1.default.Router();
router.post('/', integration_1.addOrder);
// IF: the External System generates lots of messages with unknown types
// Solution1 : Ban Intenet Protocol addresses that are spamming to Integration Layer
// Solution2 : Set a given time speed request. For example set time speed request is 5ms/ request.
//             If someone is trying to send requests with faster than 5ms (2-3ms). The request is 
//             automaticly refused and return false response
exports.default = router;
//# sourceMappingURL=integration.js.map