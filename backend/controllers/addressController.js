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
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const addresses = await Address.find({
      user: userId,
    }).populate("user");

    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};