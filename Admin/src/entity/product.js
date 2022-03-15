"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
var tslib_1 = require("tslib");
var typeorm_1 = require("typeorm");
var Product = /** @class */ (function () {
    function Product() {
    }
    tslib_1.__decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        tslib_1.__metadata("design:type", Number)
    ], Product.prototype, "id", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", String)
    ], Product.prototype, "title", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", String)
    ], Product.prototype, "image", void 0);
    tslib_1.__decorate([
        typeorm_1.Column({ default: 0 }),
        tslib_1.__metadata("design:type", Number)
    ], Product.prototype, "likes", void 0);
    Product = tslib_1.__decorate([
        typeorm_1.Entity()
    ], Product);
    return Product;
}());
exports.Product = Product;
