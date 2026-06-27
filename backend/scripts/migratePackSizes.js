// scripts/migratePackSizes.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URL);

const products = await Product.find();

for (const product of products) {
    if (!product.packSizes || product.packSizes.length === 0) {

        // replace 149 with old product.price if still present
        product.packSizes = [
            {
                label: "Pack of 1",
                units: 1,
                price: product.price || 149
            }
        ];

        await product.save();
        console.log(`Updated ${product.name}`);
    }
}

console.log("Migration complete");
process.exit();