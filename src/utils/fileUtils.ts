import multer from "multer";
import path from "path";
import fs from "fs";
import { unlink } from "fs/promises";
import { join } from "path";

// Ensure the uploads directory exists
export const uploadsDir = path.join(__dirname, "/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });

export async function deleteFile(
  folderPath: string,
  fileName: string
): Promise<void> {
  try {
    const filePath = join(folderPath, fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(filePath);
    } else {
      console.log(`File ${fileName} does not exist.`);
    }
  } catch (error) {
    console.error(`Error deleting file: ${error}`);
    throw error;
  }
}
