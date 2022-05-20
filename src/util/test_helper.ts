import FromOrder from "../models/FromOrder";
import ToOrder from "../models/ToOrder";
import CargoOrder from "../models/CargoOrder";

const fromOrdersInDb = async () =>{
    const fromOrders = await FromOrder.find({});
    return fromOrders.map(order=>order.toJSON)
}
const toOrdersInDb = async () =>{
    const toOrders = await ToOrder.find({});
    return toOrders.map(order=>order.toJSON)
}
const cargoOrdersInDb = async () =>{
    const cargoOrders = await CargoOrder.find({});
    return cargoOrders.map(order=>order.toJSON)
}

export default {
    fromOrdersInDb,
    toOrdersInDb,
    cargoOrdersInDb
}