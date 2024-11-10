import pkg from "@thirdweb-dev/storage";
import { fileURLToPath } from 'url';
import path, { dirname } from 'path'; // Import dirname from path
import fs from 'fs';
const { ThirdwebStorage } = pkg;

// Set __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Instantiate the ThirdwebStorage class with your secret key
const storage = new ThirdwebStorage({
   secretKey: "VA2Q6CKTl0-0hgVoc27ah-fnhu7ky7Ws-MSxQh-HJiPGpH8j6OQVMuxdhJYTF9fJT1H71Irl-qPcU7bc4UfZuw",
});

// Function to upload a file to IPFS
export const uploadFile = async (fileBuffer, fileName) => {
  try {
    const uploadedUrl = await storage.upload(fileBuffer, { filename: fileName });
    console.log("File uploaded successfully:", uploadedUrl);
    return uploadedUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error; // Propagate the error to handle it where the function is called
  }
};

// Function to download a file from IPFS
export const downloadFile = async (ipfsUrl) => {
  try {
    const fileBlob = await storage.download(ipfsUrl);
    console.log("File downloaded successfully:", fileBlob);
    return fileBlob;
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error; // Propagate the error
  }
};

// Example usage - Uploading a specific PDF file from the filesystem


//export const uploadToIPFS = uploadFile; // This should be present to export the function
