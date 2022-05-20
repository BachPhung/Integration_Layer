import OrderServ from '../services/integration'
import { Request, Response } from 'express'
import CargoOrder, { CargoOrderDocument } from '../models/CargoOrder'
import FromOrder, { FromOrderDocument } from '../models/FromOrder'
import ToOrder, { ToOrderDocument } from '../models/ToOrder'
import axios from 'axios'
import { formatOrder } from '../util/formatOrder'
import { requestMethod } from '../util/requestMethod'

/* STABILITY
*Advantage of implementing integration layer
  -> Have a separate layer that the requests from the external system without compromising the Seaber
     internal system. Seaber system can be protected from DDoS or malwares.
*Drawback of implemeting integration layer
  -> Affects the project timelines and costs as it adds another layer of complexity to the system that 
     having to handle communication between layers
*/
export const addOrder = async (req: Request, res: Response) => {
  try {
    const body: FromOrderDocument | ToOrderDocument | CargoOrderDocument = req.body
    const typeReq: string = body.type;
    const orderIdReq: string = body.extOrderId;
    const SeaberURL = 'https://seaber-system.com' // FAKE ADDRESS

    let newOrder: any;

    if (!(!!(req.body.fromLocation || req.body.toLocation || (req.body.cargoType && req.body.cargoAmount)))) {
      throw new Error("Wrong message")
    }

    if (typeReq && orderIdReq) {
      // Check existed types of order
      //TODO 1: FETCH TYPES FROM DATABASE
      let fetchFromOrder = await OrderServ.findAllFromOrder();
      let fetchToOrder = await OrderServ.findAllToOrder();
      let fetchCargoOrder = await OrderServ.findAllCargoOrder();
      
      await Promise.all([fetchCargoOrder, fetchFromOrder, fetchToOrder]);
      //TODO 2: CHECK AVAILABILITY
      let toOrderExisted = (fetchToOrder).find(order => order.extOrderId === orderIdReq);
      let fromOrderExisted = (fetchFromOrder).find(order => order.extOrderId == orderIdReq);
      let cargoOrderExisted = (fetchCargoOrder).find(order => order.extOrderId === orderIdReq);

      switch (typeReq) {
        case 'from': {
          // IF: Messages from External System are duplicated
          // TODO1: Check existed order from the database
          fromOrderExisted
            // TODO2: Existed: ignore and send error response back to External system
            ? res.status(400).json("Existed message") // Ignore the request is sending existed message
            // TODO3: Else: Save to database
            : (newOrder = await OrderServ.create(new FromOrder(body)))

          // Check whether the order is ready or not
          if (toOrderExisted && cargoOrderExisted && newOrder) {
            // Ready -> Send POST request to Seaber
            const readyOrder = formatOrder(newOrder, toOrderExisted, cargoOrderExisted);
            await requestMethod(SeaberURL, readyOrder)
          }
          break;
        }
        case 'to': {
          toOrderExisted
            ? res.status(400).json("Existed message")
            : (newOrder = await OrderServ.create(new ToOrder(body)))
          if (fromOrderExisted && cargoOrderExisted && newOrder) {
            const readyOrder = formatOrder(fromOrderExisted, newOrder, cargoOrderExisted);
            await requestMethod(SeaberURL, readyOrder)
          }
          break;
        }
        case 'cargo': {
          console.log("Cargo");
          
          cargoOrderExisted
            ? res.status(400).json("Existed message")
            : (newOrder = await OrderServ.create(new CargoOrder(body)))
          console.log("check fromOrder", fromOrderExisted);
          console.log("check toOrder", toOrderExisted);
          console.log("check newOrder", newOrder);
          
          
          if (fromOrderExisted && toOrderExisted && newOrder) {
            const readyOrder = formatOrder(fromOrderExisted, toOrderExisted, newOrder);
            console.log("Calling POST REQUEST");
            
            await requestMethod(SeaberURL, readyOrder)
              .then(()=>res.status(400).json("Success"))
              .catch(err=>res.status(503).json(err))
          }
          break;
        }
        default: {
          throw new Error("Unknown type of order");
        }
      }
      res.status(200).json(newOrder)
    }
    else {
      throw new Error("Wrong message")
    }
  }
  catch (err: any) {
    if (axios.isAxiosError(err)) {
      res.status(503).json(err.config.timeoutErrorMessage || err.message)
    }
    else if (err instanceof Error) { res.status(400).json(err.message) }
  }
}