import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import {uploadToCloudinary} from "../utils/uploadToCloudinary.js"
import ProductNotification from "../models/ProductNotification.js";
import { sendEmail } from "../utils/sendEmail.js";
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
            ingredients,
            faqs,
            howToEnjoy,
            nutrition,
            isLaunched,
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

        const nutritionObject = nutrition
        ? JSON.parse(nutrition)
        : {
            servingSize: "",
            servingsPerPack: 1,
            nutrients: [],
            note: ""
        };

        const isLaunchedValue =
            isLaunched === undefined ? true : (isLaunched === true || isLaunched === "true");

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
            ingredients: ingredientsArray,
            faqs,
            howToEnjoy,
            nutrition: nutritionObject,
            isLaunched: isLaunchedValue, 
        });

        return res.status(201).json({
            message: "Product created successfully",
            product
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message
        });
    }
};


// export const getProducts=async (req,res) => {
//     try {
//         const products=await Product.find().populate("category");
//         res.status(200).json(products);
//     } catch (error) {
//         return res.status(500).json({message:error.message});
//     }
// }

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("category");
        res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getAllProductsAdmin = async (req, res) => {
    try {
        const products = await Product.find().populate("category");
        res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ message: error.message });
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

// export const updateProduct=async (req,res) => {
//     try {
//         const product=await Product.findByIdAndUpdate(req.params.id,req.body,{new:true});
//         if (!product) {
//             return res.status(404).json({
//                 message: "Product not found"
//             });
//         }

//         res.status(200).json(product);
//     } catch (error) {
//         return res.status(500).json({message:error.message});
//     }
// }

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

// export const updateProduct = async (req, res) => {
//     try {
//         const oldProduct = await Product.findById(req.params.id);

//         if (!oldProduct) {
//             return res.status(404).json({
//                 message: "Product not found"
//             });
//         }

//         const wasUnavailable =
//             oldProduct.stock === 0 || oldProduct.stock === undefined;

//         const product = await Product.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true }
//         );

//         // 🔥 Check if product just became available
//         const isNowAvailable =
//             product.stock > 0;

//         if (wasUnavailable && isNowAvailable) {
            
//             const subs = await ProductNotification.find({
//                 product: product._id,
//                 notified: false
//             });

//             for (let sub of subs) {
//                 await sendEmail(
//                     sub.email,
//                     `${product.name} is now available 🎉`,
//                     `
//                         <h2>Good news!</h2>
//                         <p><b>${product.name}</b> is now back in stock.</p>
//                         <p>Go grab it before it runs out again!</p>
//                     `
//                 );

//                 sub.notified = true;
//                 await sub.save();
//             }
//         }

//         return res.status(200).json(product);

//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// };

// export const updateProduct = async (req, res) => {
//     try {
//         const oldProduct = await Product.findById(req.params.id);

//         if (!oldProduct) {
//             return res.status(404).json({ message: "Product not found" });
//         }

//         console.log("DEBUG req.body:", req.body);
//         console.log("DEBUG oldProduct.stock:", oldProduct.stock, typeof oldProduct.stock);

//         const wasUnavailable =
//             oldProduct.stock === 0 || oldProduct.stock === undefined;

//         const product = await Product.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true }
//         );

//         const isNowAvailable = product.stock > 0;

//         console.log("DEBUG new product.stock:", product.stock, typeof product.stock);
//         console.log("DEBUG wasUnavailable:", wasUnavailable, "isNowAvailable:", isNowAvailable);

//         if (wasUnavailable && isNowAvailable) {
//             console.log("DEBUG entered notification block");
//             const subs = await ProductNotification.find({
//                 product: product._id,
//                 notified: false
//             });
//             console.log("DEBUG subs found:", subs.length, subs);

//             for (let sub of subs) {
//                 await sendEmail(
//                     sub.email,
//                     `${product.name} is now available 🎉`,
//                     `<h2>Good news!</h2><p><b>${product.name}</b> is now back in stock.</p>`
//                 );
//                 sub.notified = true;
//                 await sub.save();
//             }
//         } else {
//             console.log("DEBUG skipped notification block");
//         }

//         return res.status(200).json(product);

//     } catch (error) {
//         console.error("DEBUG updateProduct error:", error);
//         return res.status(500).json({ message: error.message });
//     }
// };

// export const updateProduct = async (req, res) => {
//     try {
//         const oldProduct = await Product.findById(req.params.id);

//         if (!oldProduct) {
//             return res.status(404).json({ message: "Product not found" });
//         }
//         console.log("DEBUG oldProduct.isLaunched:", oldProduct.isLaunched);
//         console.log("DEBUG req.body.isLaunched:", req.body.isLaunched);
//         const wasOutOfStock = oldProduct.stock === 0 || oldProduct.stock === undefined;
//         const wasNotLaunched = oldProduct.isLaunched === false;
//         console.log("DEBUG wasNotLaunched:", wasNotLaunched);
//         const product = await Product.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true }
//         );

//         const isNowInStock = product.stock > 0;
//         const isNowLaunched = product.isLaunched === true;

//         const justLaunched = wasNotLaunched && isNowLaunched;
//         const justRestocked = !wasNotLaunched && wasOutOfStock && isNowInStock;

//         if (justLaunched || justRestocked) {
//             const subs = await ProductNotification.find({
//                 product: product._id,
//                 notified: false
//             });

//             for (let sub of subs) {
//                 const subject = justLaunched
//                     ? `${product.name} is now LIVE 🚀`
//                     : `${product.name} is back in stock 🎉`;

//                 const html = justLaunched
//                     ? `<h2>It's here!</h2><p><b>${product.name}</b> has just launched.</p><p>Be one of the first to grab it!</p>`
//                     : `<h2>Good news!</h2><p><b>${product.name}</b> is now back in stock.</p><p>Go grab it before it runs out again!</p>`;

//                 await sendEmail(sub.email, subject, html);

//                 sub.notified = true;
//                 await sub.save();
//             }
//         }

//         return res.status(200).json(product);

//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// };

// export const updateProduct = async (req, res) => {
//     try {
//         const oldProduct = await Product.findById(req.params.id);

//         if (!oldProduct) {
//             return res.status(404).json({ message: "Product not found" });
//         }
        
//         const parseIfString = (value) => {
//         if (typeof value === "string") {
//             try {
//             return JSON.parse(value);
//             } catch (e) {
//             return value;
//             }
//         }
//         return value;
//         };

//         req.body.nutrition = parseIfString(req.body.nutrition);
//         req.body.faqs = parseIfString(req.body.faqs);
//         req.body.packSizes = parseIfString(req.body.packSizes);
//         req.body.howToEnjoy = parseIfString(req.body.howToEnjoy);

//         const wasOutOfStock = !oldProduct.stock || oldProduct.stock <= 0;
//         const wasNotLaunched = oldProduct.isLaunched === false;

//         const product = await Product.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true, runValidators: true }
//         );

//         const isNowInStock = product.stock > 0;
//         const isNowLaunched = product.isLaunched === true;

//         const justLaunched = wasNotLaunched && isNowLaunched;
//         const justRestocked = !wasNotLaunched && wasOutOfStock && isNowInStock;

//         console.log("DEBUG:", { wasOutOfStock, wasNotLaunched, isNowInStock, isNowLaunched, justLaunched, justRestocked });

//         if (justLaunched || justRestocked) {
//             const subs = await ProductNotification.find({
//                 product: product._id,
//                 notified: false
//             });

//             console.log(`DEBUG: found ${subs.length} subscribers to notify for product ${product._id}`);

//             for (const sub of subs) {
//                 const subject = justLaunched
//                     ? `${product.name} is now LIVE 🚀`
//                     : `${product.name} is back in stock 🎉`;

//                 const html = justLaunched
//                     ? `<h2>It's here!</h2><p><b>${product.name}</b> has just launched.</p><p>Be one of the first to grab it!</p>`
//                     : `<h2>Good news!</h2><p><b>${product.name}</b> is now back in stock.</p><p>Go grab it before it runs out again!</p>`;

//                 try {
//                     await sendEmail(sub.email, subject, html);
//                     // delete instead of marking notified, so the user can re-subscribe later
//                     await ProductNotification.deleteOne({ _id: sub._id });
//                 } catch (emailErr) {
//                     console.error(`Failed to email ${sub.email} for product ${product._id}:`, emailErr.message);
//                     // don't delete — leave it so it can be retried on the next restock/launch,
//                     // and don't let one failure block the rest of the batch
//                 }
//             }
            
//         }

//         return res.status(200).json(product);

//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// };

export const getUpcomingProducts = async (req, res) => {
    try {
        const products = await Product.find({ isLaunched: false }).populate("category");
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProduct = async (req, res) => {
  try {
    const oldProduct = await Product.findById(req.params.id);

    if (!oldProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // -----------------------------
    // SAFE JSON PARSER
    // -----------------------------
    const parseIfString = (value) => {
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      }
      return value;
    };

    req.body.nutrition = parseIfString(req.body.nutrition);
    req.body.faqs = parseIfString(req.body.faqs);
    req.body.packSizes = parseIfString(req.body.packSizes);
    req.body.howToEnjoy = parseIfString(req.body.howToEnjoy);

    // -----------------------------
    // STOCK / LAUNCH FLAGS
    // -----------------------------
    const wasOutOfStock = !oldProduct.stock || oldProduct.stock <= 0;
    const wasNotLaunched = oldProduct.isLaunched === false;

    // // -----------------------------
    // HANDLE IMAGE UPDATE (MAIN IMAGE)
    // -----------------------------
   if (req.files?.image?.[0]) {
    const mainImageResult = await uploadToCloudinary(req.files.image[0].buffer);
    req.body.image = mainImageResult.secure_url;
    } else if (req.body.removeMainImage === "true") {
    req.body.image = "";
    }

    // -----------------------------
    // HANDLE ADDITIONAL IMAGES
    // -----------------------------
    const keptImages = req.body.existingAdditionalImages !== undefined
    ? parseIfString(req.body.existingAdditionalImages)
    : (oldProduct.additionalImages || []);

    let newImages = [];
    if (req.files?.additionalImages?.length > 0) {
    for (const file of req.files.additionalImages) {
        const result = await uploadToCloudinary(file.buffer);
        newImages.push(result.secure_url);
    }
    }

    req.body.additionalImages = [...keptImages, ...newImages];

    // -----------------------------
    // UPDATE PRODUCT
    // -----------------------------
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // -----------------------------
    // STATUS CHECK
    // -----------------------------
    const isNowInStock = product.stock > 0;
    const isNowLaunched = product.isLaunched === true;

    const justLaunched = wasNotLaunched && isNowLaunched;
    const justRestocked =
      !wasNotLaunched && wasOutOfStock && isNowInStock;

    console.log("DEBUG:", {
      wasOutOfStock,
      wasNotLaunched,
      isNowInStock,
      isNowLaunched,
      justLaunched,
      justRestocked
    });

    // -----------------------------
    // EMAIL NOTIFICATIONS
    // -----------------------------
    if (justLaunched || justRestocked) {
      const subs = await ProductNotification.find({
        product: product._id,
        notified: false
      });

      for (const sub of subs) {
        const subject = justLaunched
          ? `${product.name} is now LIVE 🚀`
          : `${product.name} is back in stock 🎉`;

        const html = justLaunched
          ? `<h2>It's here!</h2><p><b>${product.name}</b> has just launched.</p>`
          : `<h2>Good news!</h2><p><b>${product.name}</b> is back in stock.</p>`;

        try {
          await sendEmail(sub.email, subject, html);

          await ProductNotification.deleteOne({
            _id: sub._id
          });
        } catch (err) {
          console.error(
            `Email failed for ${sub.email}:`,
            err.message
          );
        }
      }
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};