// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     // items: [
//     //   {
//     //     product: {
//     //       type: mongoose.Schema.Types.ObjectId,
//     //       ref: "Product",
//     //       required: true,
//     //     },

//     //     quantity: {
//     //       type: Number,
//     //       required: true,
//     //     },

//     //     price: {
//     //       type: Number,
//     //       required: true,
//     //     },
//     //   },
//     // ],

//     items: [
//       {
//         product: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Product",
//           required: true
//         },

//         quantity: {
//           type: Number,
//           required: true
//         },

//         pack: {
//           label: String,
//           units: Number,
//           price: Number
//         },

//         price: {
//           type: Number,
//           required: true
//         }
//       }
//     ],

//     address: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Address",
//       required: true,
//     },

//     totalAmount: {
//       type: Number,
//       required: true,
//     },

//     paymentMethod: {
//       type: String,
//       enum: ["COD", "RAZORPAY"],
//       default: "COD",
//     },

//     paymentStatus: {
//       type: String,
//       enum: ["Pending", "Paid", "Failed"],
//       default: "Pending",
//     },
    

//     orderStatus: {
//       type: String,
//       enum: [
//         "Pending",
//         "Processing",
//         "Shipped",
//         "Delivered",
//         "Cancelled",
//       ],
//       default: "Pending",
//     },
//     razorpayOrderId: {
//         type: String
//     },
//     razorpayPaymentId: {
//         type: String,
//     },

//     paidAt: {
//         type: Date,
//     },
//     cancelledAt: {
//         type: Date,
//     },
    
//   },
//   {
//     timestamps: true,
//   }
// );

// export default mongoose.model("Order", orderSchema);

import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    // Normal product (optional for custom box)
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: false,
    },

    quantity: {
      type: Number,
      required: true,
      default: 1,
    },

    pack: {
      label: String,
      units: Number,
      price: Number,
    },

    price: {
      type: Number,
      required: true,
    },

    // Custom box support
    isCustomBox: {
      type: Boolean,
      default: false,
    },

    customProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    customPrice: {
      type: Number,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [orderItemSchema],

    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "RAZORPAY"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,

    paidAt: Date,
    cancelledAt: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);