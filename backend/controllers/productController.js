import Product from "../models/Product.js";

export const createProduct=async (req,res) => {
    try {
        let {name,description,price,category,stock,image}=req.body;
        const productExist = await Product.findOne({ name });

        if (productExist) {
            return res.status(400).json({
                message: "Product already exists"
            });
        }
        const product=await Product.create({
            name,
            description,
            price,
            category,//send category id
            stock,
            image
        })
        return res.status(201).json({
            message: "Product created successfully",
            product
        });
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const getProducts=async (req,res) => {
    try {
        const products=await Product.find();
        res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

export const getProductsById=async(req,res)=>{
    try {
        let {id}=req.params;
        const product=await Product.findById({id});
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