import { Router } from "express";
import {
  getProduct,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controller/product_controller";

const productRoutes = Router();

productRoutes.get("/", getProducts);
productRoutes.get("/:id", getProduct);
productRoutes.post("/", addProduct);
productRoutes.put("/:id", updateProduct);
productRoutes.delete("/:id", deleteProduct);

export default productRoutes;
