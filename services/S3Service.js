import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import path from 'path';
import config from "../utils/config.js";
import { ImageUploadError } from "../errors/ProductosErrors.js";

const s3Client = new S3Client({
  region: config.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY
  }
});

export const uploadToS3 = async (file) => {
  const uniqueKey = `${uuidv4()}${path.extname(file.originalname)}`;

  const params = {
    Bucket: config.AWS_BUCKET_NAME,
    Key: uniqueKey,     
    Body: file.buffer,          
    ContentType: file.mimetype  
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    const url = `https://${config.AWS_BUCKET_NAME}.s3.${config.AWS_BUCKET_REGION}.amazonaws.com/${uniqueKey}`;
    return url;
  } catch (error) {
    throw new ImageUploadError("Error al subir la imagen al servidor.");
  }
};