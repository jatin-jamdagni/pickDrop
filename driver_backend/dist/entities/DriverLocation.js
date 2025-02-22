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
exports.DriverLocation = void 0;
const typeorm_1 = require("typeorm");
const Driver_1 = require("./Driver");
let DriverLocation = class DriverLocation {
};
exports.DriverLocation = DriverLocation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], DriverLocation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Driver_1.Driver, (driver) => driver.locations),
    __metadata("design:type", Driver_1.Driver)
], DriverLocation.prototype, "driver", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DriverLocation.prototype, "driverId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "float" }),
    __metadata("design:type", Number)
], DriverLocation.prototype, "lat", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "float" }),
    __metadata("design:type", Number)
], DriverLocation.prototype, "lng", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], DriverLocation.prototype, "timestamp", void 0);
exports.DriverLocation = DriverLocation = __decorate([
    (0, typeorm_1.Entity)()
], DriverLocation);
