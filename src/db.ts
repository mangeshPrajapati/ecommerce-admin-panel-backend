import { DataSource } from "typeorm";
import { testImages } from "./entity/Images";
import { Products } from "./entity/product_entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: "postgresql://inovant:IOe9Xc8DDOgFfRQ5IFy2enH2ND4wiUvr@dpg-cvi06iin91rc73ajhg40-a.virginia-postgres.render.com/inovant_solution_assignment", // <== Paste your URL here
  ssl: {
    rejectUnauthorized: false, // Important for cloud-hosted PostgreSQL
  },
  synchronize: true,
  logging: false,
  entities: [Products, testImages],
});
