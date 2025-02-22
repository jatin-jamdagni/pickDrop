"use strict";
// // import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
// // import { Route } from "./Route";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickupPoint = void 0;
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
const typeorm_1 = require("typeorm");
const Route_1 = require("./Route");
let PickupPoint = class PickupPoint {
};
exports.PickupPoint = PickupPoint;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], PickupPoint.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Route_1.Route, (route) => route.pickupPoints),
    __metadata("design:type", Route_1.Route)
], PickupPoint.prototype, "route", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "float" }),
    __metadata("design:type", Number)
], PickupPoint.prototype, "lat", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "float" }),
    __metadata("design:type", Number)
], PickupPoint.prototype, "lng", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PickupPoint.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: ["pending", "reached", "completed"], default: "pending" }),
    __metadata("design:type", String)
], PickupPoint.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], PickupPoint.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }) // Default to current time
    ,
    __metadata("design:type", Date)
], PickupPoint.prototype, "scheduledPickupTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], PickupPoint.prototype, "reachedAt", void 0);
exports.PickupPoint = PickupPoint = __decorate([
    (0, typeorm_1.Entity)()
], PickupPoint);
