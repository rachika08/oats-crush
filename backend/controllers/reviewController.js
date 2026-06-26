import express from "express";
import User from "../models/User.js";
import Product from "../models/Product.js";

export const postReviews= async(req,res)=>{
    try{
        const user=req.user.id;

    }catch(err){
        return res.status(500).json(error.message);
    }
}