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

AppDataSource.initialize()
  .then(() => console.log("Database Connected"))
  .catch((err) => console.error("Database Connection Error", err));

app.use("/uploads", express.static(uploadsDir));
app.use("/api/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
