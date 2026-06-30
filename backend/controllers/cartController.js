import Cart from "../models/cartModel.js";

// ADD TO CART
// export const addToCart = async (req, res) => {
//     try {
//         const userId = req.user.id; // from auth middleware
//         const { productId, quantity } = req.body;
//         const { productId, quantity, pack } = req.body;

//         let cart = await Cart.findOne({ user: userId });
//         console.log("user ",req.user);
//         // if cart doesn't exist → create new
//         if (!cart) {
//             cart = await Cart.create({
//                 user: userId,
//                 items: [{ product: productId, quantity }]
//             });
//             return res.status(201).json(cart);
//         }

//         // check if product already exists in cart
//         const itemIndex = cart.items.findIndex(
//             item => item.product.toString() === productId
//         );

//         if (itemIndex > -1) {
//             // update quantity
//             cart.items[itemIndex].quantity = quantity;
//         } else {
//             cart.items.push({ product: productId, quantity });
//         }

//         await cart.save();
//         res.status(200).json(cart);

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

export const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity, pack } = req.body;

        let cart = await Cart.findOne({ user: userId });

        // if cart doesn't exist → create new
        if (!cart) {
            cart = await Cart.create({
                user: userId,
                items: [
                    {
                        product: productId,
                        quantity,
                        pack
                    }
                ]
            });

            return res.status(201).json(cart);
        }

        // check if same product + same pack exists
        const itemIndex = cart.items.findIndex(item =>
            item.product.toString() === productId &&
            item.pack?.label === pack?.label
        );

        if (itemIndex > -1) {
            // update quantity
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({
                product: productId,
                quantity,
                pack
            });
        }
        cart.reminderCount = 0;
        cart.lastReminderAt = null;
        cart.lastReminderType = null;
        await cart.save();
        res.status(200).json(cart);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// export const getCart=async (req,res) => {
//     try {
//         const userId=req.user.id;
        
//         const cart=await Cart.findOne({user:userId}).populate("items.product");
//         if(!cart){
//             return res.status(200).json({user:userId,items:[]});
//         };
//         res.status(200).json(cart);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

export const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not in cart" });
        }

        // if quantity becomes 0 → remove item
        if (quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }
        cart.reminderCount = 0;
        cart.lastReminderAt = null;
        cart.lastReminderType = null;
        await cart.save();
        res.status(200).json(cart);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(
            item => item.product.toString() !== productId
        );
        cart.reminderCount = 0;
        cart.lastReminderAt = null;
        cart.lastReminderType = null;
        await cart.save();
        res.status(200).json(cart);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ user: userId })
            .populate("items.product");

        if (!cart) {
            return res.status(200).json({ user: userId, items: [] });
        }

        const enrichedItems = cart.items.map(item => {
            const pack = item.pack || {
                label: "Pack of 1",
                units: 1,
                price: item.product.price || 0
            };

            const unitPrice = Number(pack.price) || 0;
            const quantity = Number(item.quantity) || 0;

            return {
                ...item._doc,
                pack,
                subtotal: unitPrice * quantity,
                totalUnits: quantity * (pack.units || 1)
            };
        });
        console.log(enrichedItems);
        const totalPrice = enrichedItems.reduce(
            (sum, item) => sum + (Number(item.subtotal) || 0),
            0
        );

        res.status(200).json({
            user: userId,
            items: enrichedItems,
            totalPrice
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};