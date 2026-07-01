import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                // required: true
            },
            quantity: {
                type: Number,
                default: 1
            },
            pack: {
                label: { type: String },
                units: { type: Number },
                price: { type: Number }
            },
            // -------- Custom Box --------

            isCustomBox: {
                type: Boolean,
                default: false
            },

            packSize: Number,

            customProducts: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product"
                }
            ],

            customPrice: Number
        }
    ],
    reminderCount: {
        type: Number,
        default: 0
    },

    lastReminderAt: {
        type: Date,
        default: null
    },
    lastReminderType: {
        type: String,
        default: null // "1h", "6h", "24h"
    }
}, { timestamps: true });

export default mongoose.model("Cart", cartSchema);