import axios from "axios";
import { OrderType } from "../models/Order";

const timeoutRequest:number = 1500;
const timeoutErrorMessage:string = "Seaber system doesn't response. Please fix the system before sending request again"
const finallyMessage:string = "Sent request to Seaber server"

export const requestMethod = (baseUrl: string, data:OrderType): Promise<any> =>{
    return axios.post(baseUrl,data,{timeout: timeoutRequest, timeoutErrorMessage: timeoutErrorMessage})
        .catch((err) => { throw err })
        .finally(() => console.log(finallyMessage));
}

export default requestMethod;
