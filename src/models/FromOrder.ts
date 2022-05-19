import { Schema, model, Document } from "mongoose";

export type FromOrderDocument = Document & {
    extOrderId: string,
    type: string,
    fromLocation: string
};

const FromOrderSchema = new Schema<FromOrderDocument>({
    extOrderId:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    fromLocation:{
        type: String,
        required: true
    }
}, {timestamps:true})

export default model<FromOrderDocument>('FromOrder', FromOrderSchema);