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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FromOrder_1 = __importDefault(require("../models/FromOrder"));
const ToOrder_1 = __importDefault(require("../models/ToOrder"));
const CargoOrder_1 = __importDefault(require("../models/CargoOrder"));
const create = (order) => __awaiter(void 0, void 0, void 0, function* () {
    return order.save();
});
const findAllFromOrder = () => __awaiter(void 0, void 0, void 0, function* () {
    return FromOrder_1.default.find();
});
const findAllToOrder = () => __awaiter(void 0, void 0, void 0, function* () {
    return ToOrder_1.default.find();
});
const findAllCargoOrder = () => __awaiter(void 0, void 0, void 0, function* () {
    return CargoOrder_1.default.find();
});
exports.default = {
    create,
    findAllCargoOrder,
    findAllFromOrder,
    findAllToOrder
};
//# sourceMappingURL=integration.js.map