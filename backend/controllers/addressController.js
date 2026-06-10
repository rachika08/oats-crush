import Address from "../models/addressModel.js";

export const addAddress = async (req, res) => {
  try {
    const userId = req.user.id;

    const address = await Address.create({
      user: userId,
      ...req.body,
    });

    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};