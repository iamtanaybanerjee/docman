const { v2 } = require("cloudinary");
const crypto = require("crypto");
require("dotenv").config();

const cloudinary = v2;

const cloudinaryConfig = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

const generateSignature = (paramsToSign) => {
  const { api_secret } = cloudinary.config();
  const sortedParams = Object.keys(paramsToSign)
    .sort()
    .map((key) => `${key}=${paramsToSign[key]}`)
    .join("&");

  const signature = crypto
    .createHash("sha1")
    .update(sortedParams + api_secret)
    .digest("hex");

  return signature;
};

// const uploadToCloudinary = async (filePath) => {
//   try {
//     cloudinaryConfig();
//     const timestamp = Math.round(new Date().getTime() / 1000);
//     const paramsToSign = {
//       timestamp,
//     };

//     const signature = generateSignature(paramsToSign);
//     const result = await cloudinary.uploader.upload(filePath, {
//       ...paramsToSign,
//       signature,
//       api_key: process.env.CLOUDINARY_API_KEY,
//     });
//     return result;
//   } catch (error) {
//     throw error;
//   }
// };

const uploadToCloudinary = async (fileBuffer) => {
  try {
    cloudinaryConfig();
    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsToSign = { timestamp };
    const signature = generateSignature(paramsToSign);

    const result = await cloudinary.uploader.upload_stream(
      {
        ...paramsToSign,
        signature,
        api_key: process.env.CLOUDINARY_API_KEY,
      },
      (error, result) => {
        if (error) throw error;
        return result;
      }
    );

    // Convert to a Promise
    return new Promise((resolve, reject) => {
      const stream = result;
      stream.on("finish", resolve);
      stream.on("error", reject);
      stream.end(fileBuffer); // send the buffer to Cloudinary
    });
  } catch (error) {
    throw error;
  }
};

module.exports = { cloudinaryConfig, uploadToCloudinary };
