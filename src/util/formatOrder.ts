import { ToOrderDocument } from "../models/ToOrder";
import { FromOrderDocument } from "../models/FromOrder";
import { CargoOrderDocument } from "../models/CargoOrder";
import { OrderType } from "../models/Order";

export const formatOrder = (req1: FromOrderDocument, req2: ToOrderDocument, req3: CargoOrderDocument): OrderType =>{
    let {extOrderId, fromLocation, ...rest1} = req1;
    let {toLocation, ...rest2} = req2;
    let {cargoType, cargoAmount, ...rest3} = req3
    return {extOrderId, fromLocation, toLocation, cargoType, cargoAmount};
}