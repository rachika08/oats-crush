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

export const updateAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params; //address id

        const address = await Address.findOne({
            _id: id,
            user: userId
        });

        if (!address) {
            return res.status(404).json({
                message: "Address not found"
            });
        }

        const updatedAddress = await Address.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedAddress);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const deleteAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const address = await Address.findOne({
            _id: id,
            user: userId
        });

        if (!address) {
            return res.status(404).json({
                message: "Address not found"
            });
        }

        await Address.findByIdAndDelete(id);

        res.status(200).json({
            message: "Address deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};