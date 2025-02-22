"use strict";
// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
// import { Route } from "./Route";
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
exports.Destination = void 0;
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
const typeorm_1 = require("typeorm");
const Route_1 = require("./Route");
let Destination = class Destination {
};
exports.Destination = Destination;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Destination.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Route_1.Route, (route) => route.destinations),
    __metadata("design:type", Route_1.Route)
], Destination.prototype, "route", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "float" }),
    __metadata("design:type", Number)
], Destination.prototype, "lat", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "float" }),
    __metadata("design:type", Number)
], Destination.prototype, "lng", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Destination.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Destination.prototype, "maxTimeToReach", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: ["locked", "unlocked", "reached", "delivered"],
        default: "locked",
    }),
    __metadata("design:type", String)
], Destination.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Destination.prototype, "reachedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Destination.prototype, "deliveredAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Destination.prototype, "waitTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Destination.prototype, "remarks", void 0);
exports.Destination = Destination = __decorate([
    (0, typeorm_1.Entity)()
], Destination);
