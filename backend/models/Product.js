import mongoose from "mongoose";

const productSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    packSizes: [
        {
            label: {
                type: String,
                required: true
            },
            units: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
    },
    stock:{
        type: Number,
        default: 0,
    },
    image:{
        type:String,
    },
    additionalImages: [{
        type: String
    }],
    featured:{
        type:Boolean,
        default:false
    },
    benefits: [{
        type: String
    }],

    ingredients: [{
        type: String
    }],
    faqs: [
        {
            question: { type: String, default: "" },
            answer: { type: String, default: "" },
        },
    ],
},{timestamps:true});

export default mongoose.model("Product",productSchema);