import { Request, Response } from "express";
import { Products } from "../entity/product_entity";
import { AppDataSource } from "../db";
import { upload, uploadsDir, deleteFile } from "../utils/fileUtils";
import fs from "fs";
import path from "path";

const SERVER_URL = process.env.SERVER_URL;

export const getProducts = async (req: Request, res: Response) => {
  const products = await AppDataSource.getRepository(Products).find();
  res.json(products);
};

export const getProduct = async (req: Request, res: Response) => {
  const product = await AppDataSource.getRepository(Products).findOne({
    where: { id: Number(req.params.id) },
  });
  res.json(product);
};

export const addProduct = [
  upload.array("images", 10),
  async (req: any, res: any) => {
    try {
      if (!req.files || !(req.files instanceof Array)) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const imageUrls = req.files.map(
        (file: any) => `${SERVER_URL}/uploads/${file.filename}`
      );

      const productRepo = AppDataSource.getRepository(Products);
      const newProduct = productRepo.create({
        sku: req.body.sku,
        name: req.body.name,
        price: parseFloat(req.body.price),
        images: imageUrls,
      });

      await productRepo.save(newProduct);

      res.json({
        message: "Images uploaded and product saved",
        product: {
          id: newProduct.id,
          sku: newProduct.sku,
          name: newProduct.name,
          price: newProduct.price,
          images: newProduct.images,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
];

export const updateProduct = [
  upload.array("images", 10),
  async (req: any, res: any) => {
    try {
      const repository = AppDataSource.getRepository(Products);
      const product = await repository.findOne({
        where: { id: Number(req.params.id) },
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Process new uploaded images
      let imageUrls = product.images || [];
      if (req.files && req.files instanceof Array) {
        const newImages = req.files.map(
          (file: any) => `${SERVER_URL}/uploads/${file.filename}`
        );
        imageUrls = [...imageUrls, ...newImages]; // Append new images
      }

      // Handle image deletions if requested
      if (req.body.removeImages) {
        const imagesToRemove = req.body.removeImages;
        imagesToRemove.forEach((img: string) => {
          const filename = img.split("/").pop() || "";
          console.log(filename);
          deleteFile(path.join(__dirname, "../uploads"), filename);
        });
        imageUrls = imageUrls.filter((img) => !imagesToRemove.includes(img));
      }

      repository.merge(product, { ...req.body, images: imageUrls });
      const result = await repository.save(product);

      res.json({
        message: "Product updated successfully",
        product: {
          id: result.id,
          sku: result.sku,
          name: result.name,
          price: result.price,
          images: result.images,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
];

export const deleteProduct = async (req: Request, res: Response) => {
  const repository = AppDataSource.getRepository(Products);
  const result = await repository.delete(req.params.id);
  res.json(result);
};
