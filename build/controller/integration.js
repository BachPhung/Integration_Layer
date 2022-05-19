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
exports.addOrder = void 0;
const integration_1 = __importDefault(require("../services/integration"));
const CargoOrder_1 = __importDefault(require("../models/CargoOrder"));
const FromOrder_1 = __importDefault(require("../models/FromOrder"));
const ToOrder_1 = __importDefault(require("../models/ToOrder"));
const axios_1 = __importDefault(require("axios"));
const formatOrder_1 = require("../util/formatOrder");
/*
*Advantage of implementing integration layer
  -> Have a separate layer that the requests from the external system without compromising the Seaber
     internal system. Seaber system can be protected from DDoS or malwares.
*Drawback of implemeting integration layer
  -> Affects the project timelines and costs as it adds another layer of complexity to the system that
     having to handle communication between layers
*/
const addOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let typeReq = body.type;
        let orderIdReq = body.extOrderId;
        let newOrder;
        const SeaberURL = '';
        if (!(!!(req.body.fromLocation || req.body.toLocation || (req.body.cargoType && req.body.cargoAmount)))) {
            throw new Error("Wrong message");
        }
        if (typeReq && orderIdReq) {
            // Check existed types of order
            //TODO 1: FETCH TYPES FROM DATABASE
            let fetchFromOrder = integration_1.default.findAllFromOrder();
            let fetchToOrder = integration_1.default.findAllToOrder();
            let fetchCargoOrder = integration_1.default.findAllCargoOrder();
            yield Promise.all([fetchCargoOrder, fetchFromOrder, fetchToOrder]);
            //TODO 2: CHECK AVAILABILITY
            let fromOrderExisted = (yield fetchFromOrder).find(order => order.extOrderId === orderIdReq);
            let toOrderExisted = (yield fetchToOrder).find(order => order.extOrderId === orderIdReq);
            let cargoOrderExisted = (yield fetchCargoOrder).find(order => order.extOrderId === orderIdReq);
            switch (typeReq) {
                case 'from': {
                    // IF: Messages from External System are duplicated
                    // TODO1: Check existed order from the database
                    fromOrderExisted
                        // TODO2: Existed: ignore and send error response back to External system
                        ? res.status(400).json("Existed message") // Ignore the request is sending existed message
                        // TODO3: Else: Save to database
                        : (newOrder = yield integration_1.default.create(new FromOrder_1.default(body)));
                    // Check whether the order is ready or not
                    if (toOrderExisted && cargoOrderExisted && newOrder) {
                        // Ready -> Send POST request to Seaber
                        const readyOrder = (0, formatOrder_1.formatOrder)(newOrder, toOrderExisted, cargoOrderExisted);
                        yield axios_1.default.post(SeaberURL, readyOrder).finally(() => console.log("Sent request to Seaber server"));
                    }
                    break;
                }
                case 'to': {
                    toOrderExisted
                        ? res.status(400).json("Existed message")
                        : (newOrder = yield integration_1.default.create(new ToOrder_1.default(body)));
                    if (fromOrderExisted && cargoOrderExisted && newOrder) {
                        // Ready -> Send POST request to Seaber
                        const readyOrder = (0, formatOrder_1.formatOrder)(fromOrderExisted, newOrder, cargoOrderExisted);
                        yield axios_1.default.post(SeaberURL, readyOrder).finally(() => console.log("Sent request to Seaber server"));
                    }
                    break;
                }
                case 'cargo': {
                    cargoOrderExisted
                        ? res.status(400).json("Existed message")
                        : (newOrder = yield integration_1.default.create(new CargoOrder_1.default(body)));
                    if (fromOrderExisted && toOrderExisted && newOrder) {
                        // Ready -> Send POST request to Seaber
                        const readyOrder = (0, formatOrder_1.formatOrder)(fromOrderExisted, toOrderExisted, newOrder);
                        yield axios_1.default.post(SeaberURL, readyOrder).finally(() => console.log("Sent request to Seaber server"));
                    }
                    break;
                }
                default: {
                    throw new Error("Unknown type of order");
                }
            }
            res.status(200).json(newOrder);
        }
        else {
            throw new Error("Wrong message");
        }
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json(err.message);
        }
        else if (axios_1.default.isAxiosError(err)) {
            //  IF: The Seaber API goes down. Send reponse to external client with sensible error messages
            res.status(503).json('The Seaber server doesnot response. Please fix it');
        }
    }
});
exports.addOrder = addOrder;
//# sourceMappingURL=integration.js.map