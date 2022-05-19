import { Schema, model, Document } from "mongoose";

export type ToOrderDocument = Document & {
    extOrderId: string,
    type: string,
    toLocation: string
};

const ToOrderSchema = new Schema<ToOrderDocument>({
    extOrderId:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    toLocation:{
        type: String,
        required: true
    }
}, {timestamps:true})

export default model<ToOrderDocument>('ToOrder', ToOrderSchema);