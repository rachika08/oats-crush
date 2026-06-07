import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {

        let stream = cloudinary.uploader.upload_stream(
            {
                folder: "products"
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        streamifier.createReadStream(fileBuffer).pipe(stream);
    });
};
