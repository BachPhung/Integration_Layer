import OrderServ from '../services/integration'
import { Request, Response } from 'express'
import CargoOrder, { CargoOrderDocument } from '../models/CargoOrder'
import FromOrder, { FromOrderDocument } from '../models/FromOrder'
import ToOrder, { ToOrderDocument } from '../models/ToOrder'
import axios from 'axios'
import { formatOrder } from '../util/formatOrder'

/*
*Advantage of implementing integration layer
  -> Have a separate layer that the requests from the external system without compromising the Seaber
     internal system. Seaber system can be protected from DDoS or malwares.
*Drawback of implemeting integration layer
  -> Affects the project timelines and costs as it adds another layer of complexity to the system that 
     having to handle communication between layers
*/
export const addOrder = async (req: Request, res: Response) => {
  try {
    let body: FromOrderDocument | ToOrderDocument | CargoOrderDocument = req.body
    let typeReq: string = body.type;
    let orderIdReq: string = body.extOrderId;
    let newOrder: any;
    const SeaberURL = ''
    
    if (!(!!(req.body.fromLocation || req.body.toLocation || (req.body.cargoType && req.body.cargoAmount)))) {
      throw new Error("Wrong message")
    }

    if (typeReq && orderIdReq) {
      // Check existed types of order
      //TODO 1: FETCH TYPES FROM DATABASE
      let fetchFromOrder = OrderServ.findAllFromOrder();
      let fetchToOrder = OrderServ.findAllToOrder();
      let fetchCargoOrder = OrderServ.findAllCargoOrder();
      await Promise.all([fetchCargoOrder, fetchFromOrder, fetchToOrder]);
      //TODO 2: CHECK AVAILABILITY
      let fromOrderExisted = (await fetchFromOrder).find(order => order.extOrderId === orderIdReq);
      let toOrderExisted = (await fetchToOrder).find(order => order.extOrderId === orderIdReq);
      let cargoOrderExisted = (await fetchCargoOrder).find(order => order.extOrderId === orderIdReq);

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
            await axios.post(SeaberURL, readyOrder).finally(() => console.log("Sent request to Seaber server"));
          }
          break;
        }
        case 'to': {
          toOrderExisted
            ? res.status(400).json("Existed message")
            : (newOrder = await OrderServ.create(new ToOrder(body)))
          if (fromOrderExisted && cargoOrderExisted && newOrder) {
            // Ready -> Send POST request to Seaber
            const readyOrder = formatOrder(fromOrderExisted, newOrder, cargoOrderExisted);
            await axios.post(SeaberURL, readyOrder).finally(() => console.log("Sent request to Seaber server"));
          }
          break;
        }
        case 'cargo': {
          cargoOrderExisted
            ? res.status(400).json("Existed message")
            : (newOrder = await OrderServ.create(new CargoOrder(body)))
          if (fromOrderExisted && toOrderExisted && newOrder) {
            // Ready -> Send POST request to Seaber
            const readyOrder = formatOrder(fromOrderExisted, toOrderExisted, newOrder);
            await axios.post(SeaberURL, readyOrder).finally(() => console.log("Sent request to Seaber server"));
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
    if (err instanceof Error) { res.status(400).json(err.message) }
    else if (axios.isAxiosError(err)) {
      //  IF: The Seaber API goes down. Send reponse to external client with sensible error messages
      res.status(503).json('The Seaber server doesnot response. Please fix it')
    }
  }
}