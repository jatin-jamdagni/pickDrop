import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Driver } from "./Driver";

@Entity()
export class DriverLocation {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Driver, (driver) => driver.locations)
  driver!: Driver;

  @Column()
  driverId!: string;

  @Column({ type: "float" })
  lat!: number;

  @Column({ type: "float" })
  lng!: number;

  @Column()
  timestamp!: Date;
}