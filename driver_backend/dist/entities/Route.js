"use strict";
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
exports.Route = void 0;
const typeorm_1 = require("typeorm");
const Driver_1 = require("./Driver");
const PickupPoint_1 = require("./PickupPoint");
const Destination_1 = require("./Destination");
const RouteMetadata_1 = require("./RouteMetadata");
let Route = class Route {
};
exports.Route = Route;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Route.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Driver_1.Driver, (driver) => driver.routes),
    __metadata("design:type", Driver_1.Driver)
], Route.prototype, "driver", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Route.prototype, "driverId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PickupPoint_1.PickupPoint, (pickup) => pickup.route, { cascade: true }),
    __metadata("design:type", Array)
], Route.prototype, "pickupPoints", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Destination_1.Destination, (destination) => destination.route, { cascade: true }),
    __metadata("design:type", Array)
], Route.prototype, "destinations", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Route.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Route.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => RouteMetadata_1.RouteMetadata, (metadata) => metadata.route),
    __metadata("design:type", RouteMetadata_1.RouteMetadata)
], Route.prototype, "metadata", void 0);
exports.Route = Route = __decorate([
    (0, typeorm_1.Entity)()
], Route);
