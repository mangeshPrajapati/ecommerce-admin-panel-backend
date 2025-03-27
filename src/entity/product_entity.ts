import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Products {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  sku!: string;

  @Column()
  name!: string;

  @Column("decimal")
  price!: number;

  @Column("text", { array: true })
  images: string[] = [];
}
