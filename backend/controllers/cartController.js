import Cart from "../models/cartModel.js";
import Product from "../models/Product.js";



export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ user: userId })
            .populate("items.product")
            .populate("items.customProducts");

        if (!cart) {
            return res.status(200).json({ user: userId, items: [] });
        }

        // const enrichedItems = cart.items.map(item => {
        //     const pack = item.pack || {
        //         label: "Pack of 1",
        //         units: 1,
        //         price: item.product.price || 0
        //     };

        //     const unitPrice = Number(pack.price) || 0;
        //     const quantity = Number(item.quantity) || 0;

        //     return {
        //         ...item._doc,
        //         pack,
        //         subtotal: unitPrice * quantity,
        //         totalUnits: quantity * (pack.units || 1)
        //     };
        // });
        const enrichedItems = cart.items.map(item => {
            if (item.isCustomBox) {
                return {
                    ...item._doc,
                    subtotal: item.customPrice || 0,
                    totalUnits: item.packSize || 0
                };
            }

            const pack = item.pack?.price
                ? item.pack
                : { label: "Pack of 1", units: 1, price: item.product?.price || 0 };

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

export const addCustomBox = async (req, res) => {
    try {
        const userId = req.user.id;
        const { packSize, items } = req.body;

        // Calculate price on backend
        const PACK_PRICES = {
            20: 2500,
            30: 3000
        };

        if (!PACK_PRICES[packSize]) {
            return res.status(400).json({
                message: "Invalid pack size"
            });
        }

        if (!Array.isArray(items)) {
            return res.status(400).json({
                message: "Items must be an array"
            });
        }

        if (items.length !== packSize) {
            return res.status(400).json({
                message: `Select exactly ${packSize} products`
            });
        }

        // Verify all product ids exist
        // const count = await Product.countDocuments({
        //     _id: { $in: items }
        // });

        // if (count !== items.length) {
        //     return res.status(400).json({
        //         message: "One or more products are invalid"
        //     });
        // }

        const uniqueIds = [...new Set(items)];

        const count = await Product.countDocuments({
            _id: { $in: uniqueIds }
        });

        if (count !== uniqueIds.length){
            return res.status(400).json({
                message:"One or more products are invalid"
            });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = await Cart.create({
                user: userId,
                items: []
            });
        }

        cart.items.push({
            isCustomBox: true,
            packSize,
            customProducts: items,
            customPrice: PACK_PRICES[packSize]
        });

        cart.reminderCount = 0;
        cart.lastReminderAt = null;
        cart.lastReminderType = null;

        await cart.save();

        const updatedCart = await Cart.findById(cart._id)
            .populate("items.product")
            .populate("items.customProducts");

        res.status(201).json(updatedCart);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const removeCustomBox = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const itemIndex = cart.items.findIndex(
            item =>
                item._id.toString() === itemId &&
                item.isCustomBox
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                message: "Custom box not found"
            });
        }

        cart.items.splice(itemIndex, 1);

        cart.reminderCount = 0;
        cart.lastReminderAt = null;
        cart.lastReminderType = null;

        await cart.save();

        res.status(200).json(cart);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    let { productId, quantity, pack } = req.body;

    // 🔥 FORCE NUMBER
    quantity = Number(quantity) || 1;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [
          {
            product: productId,
            quantity,
            pack,
            isCustomBox: false,
          },
        ],
      });

      return res.status(201).json(cart);
    }

    // 🔥 SAFE MATCH (avoid undefined crash)
    const itemIndex = cart.items.findIndex((item) => {
      return (
        item.product?.toString() === productId &&
        (item.pack?.label || "") === (pack?.label || "")
      );
    });

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity =
        Number(cart.items[itemIndex].quantity) + quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        pack,
        isCustomBox: false,
      });
    }

    // reset reminders
    cart.reminderCount = 0;
    cart.lastReminderAt = null;
    cart.lastReminderType = null;

    await cart.save();

    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId, quantity } = req.body; // ← was productId

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const itemIndex = cart.items.findIndex(
            item => item._id.toString() === itemId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not in cart" });
        }

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
        const { itemId } = req.params; // ← was productId

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(
            item => item._id.toString() !== itemId
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