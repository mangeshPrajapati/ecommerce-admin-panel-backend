import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class testImages {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name?: string;

  @Column("text", { array: true })
  images: string[] = [];
}
