import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Driver } from "./Driver";
import { PickupPoint } from "./PickupPoint";
import { Destination } from "./Destination";
import { RouteMetadata } from "./RouteMetadata";

@Entity()
export class Route {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Driver, (driver) => driver.routes)
  driver!: Driver;

  @Column()
  driverId!: string;

  @OneToMany(() => PickupPoint, (pickup) => pickup.route, { cascade: true })
  pickupPoints!: PickupPoint[];

  @OneToMany(() => Destination, (destination) => destination.route, { cascade: true })
  destinations!: Destination[];

  @Column()
  startTime!: Date;

  @Column({ nullable: true })
  endTime?: Date;

  @OneToOne(() => RouteMetadata, (metadata) => metadata.route)
  metadata?: RouteMetadata;
}