import "reflect-metadata";
import express from "express";
require("dotenv").config();
const cors = require("cors");

import { testImages } from "./entity/Images";
import { AppDataSource } from "./db";
import productRoutes from "./routes/product_routes";
import { upload, uploadsDir } from "./utils/fileUtils";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.use("/api/products", productRoutes);

AppDataSource.initialize()
  .then(() => console.log("Database Connected"))
  .catch((err) => console.error("Database Connection Error", err));

app.post("/upload", upload.array("images", 10), async (req: any, res: any) => {
  try {
    if (!req.files || !(req.files instanceof Array)) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const imageUrls = req.files.map(
      (file: any) => `http://localhost:5000/uploads/${file.filename}`
    );

    const imageRepo = AppDataSource.getRepository(testImages);
    const newEntry = new testImages();
    newEntry.name = req.body.name;
    newEntry.images = imageUrls;

    await imageRepo.save(newEntry);
    res.json({ message: "Images uploaded and URLs saved", images: imageUrls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/upload", async (req: any, res: any) => {
  const allEntries = await AppDataSource.getRepository(testImages).find();
  res.json(allEntries);
});

app.use("/uploads", express.static(uploadsDir));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
