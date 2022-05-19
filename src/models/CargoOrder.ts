import { Schema, model, Document } from "mongoose";

export type CargoOrderDocument = Document & {
    extOrderId: string,
    type: string,
    cargoType: string,
    cargoAmount: number
};

const CargoOrderSchema = new Schema<CargoOrderDocument>({
    extOrderId:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    cargoType:{
        type: String,
        required: true
    },
    cargoAmount:{
        type: Number,
        required:true
    }
}, {timestamps:true})

export default model<CargoOrderDocument>('CargoOrder', CargoOrderSchema);