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
exports.RouteMetadata = void 0;
const typeorm_1 = require("typeorm");
const Route_1 = require("./Route");
let RouteMetadata = class RouteMetadata {
};
exports.RouteMetadata = RouteMetadata;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], RouteMetadata.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Route_1.Route, (route) => route.metadata),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Route_1.Route)
], RouteMetadata.prototype, "route", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RouteMetadata.prototype, "routeId", void 0);
__decorate([
    (0, typeorm_1.Column)("jsonb"),
    __metadata("design:type", Array)
], RouteMetadata.prototype, "travelTimes", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RouteMetadata.prototype, "driverName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RouteMetadata.prototype, "vehicleNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RouteMetadata.prototype, "vehicleColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RouteMetadata.prototype, "vehicleSize", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RouteMetadata.prototype, "vehicleType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RouteMetadata.prototype, "imagePath", void 0);
exports.RouteMetadata = RouteMetadata = __decorate([
    (0, typeorm_1.Entity)()
], RouteMetadata);
