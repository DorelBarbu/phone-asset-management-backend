import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Phone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  serial: string;

  @Column()
  color: string;

  @Column()
  metadata: string;
}