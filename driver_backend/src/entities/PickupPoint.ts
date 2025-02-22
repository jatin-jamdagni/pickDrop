// // import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
// // import { Route } from "./Route";

// // @Entity()
// // export class PickupPoint {
// //   @PrimaryGeneratedColumn("uuid")
// //   id!: string;

// //   @ManyToOne(() => Route, (route) => route.pickupPoints)
// //   route!: Route;

// //   @Column({ type: "float" })
// //   lat!: number;

// //   @Column({ type: "float" })
// //   lng!: number;

// //   @Column()
// //   address!: string;

// //   @Column({ type: "enum", enum: ["pending", "completed"], default: "pending" })
// //   status!: "pending" | "completed";

// //   @Column({ nullable: true })
// //   completedAt?: Date;
// // }
// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
// import { Route } from "./Route";

// @Entity()
// export class PickupPoint {
//   @PrimaryGeneratedColumn("uuid")
//   id!: string;

//   @ManyToOne(() => Route, (route) => route.pickupPoints)
//   route!: Route;

//   @Column({ type: "float" })
//   lat!: number;

//   @Column({ type: "float" })
//   lng!: number;

//   @Column()
//   address!: string;

//   @Column({ type: "enum", enum: ["pending", "completed"], default: "pending" })
//   status!: "pending" | "completed"|"reached";

//   @Column({ nullable: true })
//   completedAt?: Date;

//   @Column() // New field for scheduled pickup time
//   scheduledPickupTime!: Date;
// }
 
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Route } from "./Route";

@Entity()
export class PickupPoint {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Route, (route) => route.pickupPoints)
  route!: Route;

  @Column({ type: "float" })
  lat!: number;

  @Column({ type: "float" })
  lng!: number;

  @Column()
  address!: string;

  @Column({ type: "enum", enum: ["pending", "reached", "completed"], default: "pending" })
  status!: "pending" | "reached" | "completed";

  @Column({ nullable: true })
  completedAt?: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }) // Default to current time
  scheduledPickupTime!: Date;

  @Column({ nullable: true })
  reachedAt?: Date;
}