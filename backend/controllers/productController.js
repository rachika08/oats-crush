import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import {uploadToCloudinary} from "../utils/uploadToCloudinary.js"
// export const createProduct=async (req,res) => {
//     try {
//         let {name,description,price,category,stock,image,featured}=req.body;
//         const productExist = await Product.findOne({ name });

//         if (productExist) {
//             return res.status(400).json({
//                 message: "Product already exists"
//             });
//         }
//         if (!req.file) {
//             return res.status(400).json({ message: "Image file is required" });
//         }
//         const result = await uploadToCloudinary(req.file.buffer);

//         const imageUrl = result.secure_url;
//         const product=await Product.create({
//             name,
//             description,
//             price,
//             category,//send category id
//             stock,
//             image:imageUrl,
//             featured
//         })
//         return res.status(201).json({
//             message: "Product created successfully",
//             product
//         });
//     } catch (error) {
//         return res.status(500).json({message:error.message})
//     }
// }

export const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            // price,
            category,
            stock,
            featured,
            benefits,
            ingredients
        } = req.body;
        const packSizes = JSON.parse(req.body.packSizes);
        const productExist = await Product.findOne({ name });

        if (productExist) {
            return res.status(400).json({
                message: "Product already exists"
            });
        }

        // Main image validation
        if (!req.files || !req.files.image) {
            return res.status(400).json({
                message: "Main product image is required"
            });
        }

        // Upload main image
        const mainImageResult = await uploadToCloudinary(
            req.files.image[0].buffer
        );

        const imageUrl = mainImageResult.secure_url;

        // Upload additional images
        const additionalImages = [];

        if (req.files.additionalImages) {
            for (const file of req.files.additionalImages) {
                const result = await uploadToCloudinary(file.buffer);

                additionalImages.push(result.secure_url);
            }
        }
        console.log(additionalImages);

        // Parse arrays coming from FormData
        const benefitsArray = benefits
            ? JSON.parse(benefits)
            : [];

        const ingredientsArray = ingredients
            ? JSON.parse(ingredients)
            : [];

        // Convert featured to boolean
        const featuredValue =
            featured === true || featured === "true";

        const product = await Product.create({
            name,
            description,
            // price,
            packSizes,
            category,
            stock,
            image: imageUrl,
            additionalImages,
            featured: featuredValue,
            benefits: benefitsArray,
            ingredients: ingredientsArray
        });

        return res.status(201).json({
            message: "Product created successfully",
            product
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


export const getProducts=async (req,res) => {
    try {
        const products=await Product.find().populate("category");
        res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

export const getProductsById=async(req,res)=>{
    try {
        let {id}=req.params;
        console.log("ID", req.params.id);
        const product=await Product.findById(id).populate("category");
        if(!product){
            return res.status(404).json({message:"not found"});
        }
        res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

export const updateProduct=async (req,res) => {
    try {
        const product=await Product.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

export const deleteProduct=async(req,res)=>{
    try {
        const product=await Product.findByIdAndDelete(req.params.id);
        if(!product){
            return res.status(404).json({message:"invalid product"});
        }
        res.status(200).json({message:"product deleted successfully"})
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

export const featuredProduct=async(req,res)=>{
    try {
        const product=await Product.find({
            featured:true
        }).populate("category");
        res.status(200).json(product);

    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

export const getProductsByCategory=async (req,res) => {
    try {
        const {categoryId}=req.params;
        const products=await Product.find({
            category:categoryId
        }).populate("category");
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({
            message:error.message
        });
    }
}