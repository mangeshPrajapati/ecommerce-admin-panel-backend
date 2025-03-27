import { DataSource } from "typeorm";
import { testImages } from "./entity/Images";
import { Products } from "./entity/product_entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DB_CONNECTION_STRING, // <== Paste your URL here
  ssl: {
    rejectUnauthorized: false, // Important for cloud-hosted PostgreSQL
  },
  synchronize: true,
  logging: false,
  entities: [Products, testImages],
});
