import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Route } from "./Route";

@Entity()
export class RouteMetadata {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToOne(() => Route, (route) => route.metadata)
  @JoinColumn()
  route!: Route;

  @Column()
  routeId!: string;

  @Column("jsonb")
  travelTimes!: { from: { lat: number; lng: number }; to: { lat: number; lng: number }; timeMinutes: number }[];

  @Column()
  driverName!: string;

  @Column()
  vehicleNumber!: string;

  @Column({ nullable: true })
  vehicleColor?: string;

  @Column({ nullable: true })
  vehicleSize?: string;

  @Column({ nullable: true })
  vehicleType?: string;

  @Column()
  imagePath!: string; // Path to the saved route map image
}