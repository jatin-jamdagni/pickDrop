import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index, ManyToOne } from "typeorm";
import { Route } from "./Route";
import { DriverLocation } from "./DriverLocation";
import { Admin } from "./Admin";

@Entity()
@Index(["vehicleNumber"], { unique: true })
export class Driver {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  vehicleNumber!: string;

  @Column()
  password!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  licenseNumber?: string;

  @Column({ nullable: true })
  panNumber?: string;

  @Column({ nullable: true })
  aadharNumber?: string;

  @Column({ nullable: true })
  vehicleColor?: string;

  @Column({ nullable: true })
  vehicleSize?: string;

  @Column({ nullable: true })
  vehicleType?: string;

  @Column({ type: "float", default: 0 })
  lat!: number;

  @Column({ type: "float", default: 0 })
  lng!: number;

  @OneToMany(() => Route, (route) => route.driver)
  routes!: Route[];

  @OneToMany(() => DriverLocation, (location) => location.driver)
  locations!: DriverLocation[];

  @ManyToOne(() => Admin, (admin) => admin.drivers) // New relationship
  admin!: Admin;

  @Column({ nullable: true }) // New field
  adminId?: string;
}