import FromOrder, { FromOrderDocument } from "../models/FromOrder";
import ToOrder, { ToOrderDocument } from "../models/ToOrder";
import CargoOrder, { CargoOrderDocument } from "../models/CargoOrder";

const create = async (order: FromOrderDocument | ToOrderDocument | CargoOrderDocument)
    : Promise<FromOrderDocument | ToOrderDocument | CargoOrderDocument> => {
    return order.save()
}
const findAllFromOrder = async () : Promise<FromOrderDocument[]> =>{
    return FromOrder.find()
}
const findAllToOrder = async () : Promise<ToOrderDocument[]> =>{
    return ToOrder.find()
}
const findAllCargoOrder = async () : Promise<CargoOrderDocument[]> =>{
    return CargoOrder.find()
}

export default {
    create,
    findAllCargoOrder,
    findAllFromOrder,
    findAllToOrder
}