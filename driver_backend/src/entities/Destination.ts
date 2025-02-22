// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
// import { Route } from "./Route";

// @Entity()
// export class Destination {
//   @PrimaryGeneratedColumn("uuid")
//   id!: string;

//   @ManyToOne(() => Route, (route) => route.destinations)
//   route!: Route;

//   @Column({ type: "float" })
//   lat!: number;

//   @Column({ type: "float" })
//   lng!: number;

//   @Column()
//   address!: string;

//   @Column()
//   maxTimeToReach!: number;

//   @Column({
//     type: "enum",
//     enum: ["locked", "unlocked", "reached", "delivered"],
//     default: "locked",
//   })
//   status!: "locked" | "unlocked" | "reached" | "delivered";

//   @Column({ nullable: true })
//   reachedAt?: Date;

//   @Column({ nullable: true })
//   deliveredAt?: Date;

//   @Column({ nullable: true })
//   waitTime?: number;

//   @Column({ nullable: true })
//   remarks?: string;
// }


import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Route } from "./Route";

@Entity()
export class Destination {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Route, (route) => route.destinations)
  route!: Route;

  @Column({ type: "float" })
  lat!: number;

  @Column({ type: "float" })
  lng!: number;

  @Column()
  address!: string;

  @Column()
  maxTimeToReach!: number;

  @Column({
    type: "enum",
    enum: ["locked", "unlocked", "reached", "delivered"],
    default: "locked",
  })
  status!: "locked" | "unlocked" | "reached" | "delivered";

  @Column({ nullable: true })
  reachedAt?: Date;

  @Column({ nullable: true })
  deliveredAt?: Date;

  @Column({ nullable: true })
  waitTime?: number;

  @Column({ nullable: true })
  remarks?: string;
}