"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var express = require("express");
var cors = require("cors");
var typeorm_1 = require("typeorm");
var product_1 = require("./entity/product");
var morgan = require("morgan");
typeorm_1.createConnection().then(function (db) {
    var productRepository = db.getRepository(product_1.Product);
    var app = express();
    app.use(cors({
        origin: ["http://localhost:3000"],
    }));
    app.use(morgan('combined'));
    app.use(express.json());
    app.get("/api/products", function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var products;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, productRepository.find()];
                case 1:
                    products = _a.sent();
                    res.json(products);
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/products", function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var product, result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, productRepository.create(req.body)];
                case 1:
                    product = _a.sent();
                    return [4 /*yield*/, productRepository.save(product)];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, res.send(result)];
            }
        });
    }); });
    app.get("/api/products/:id", function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var product;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, productRepository.findOne(req.params.id)];
                case 1:
                    product = _a.sent();
                    return [2 /*return*/, res.send(product)];
            }
        });
    }); });
    app.put("/api/products/:id", function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var product, result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, productRepository.findOne(req.params.id)];
                case 1:
                    product = _a.sent();
                    productRepository.merge(product, req.body);
                    return [4 /*yield*/, productRepository.save(product)];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, res.send(result)];
            }
        });
    }); });
    app.delete("/api/products/:id", function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var product;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, productRepository.delete(req.params.id)];
                case 1:
                    product = _a.sent();
                    return [2 /*return*/, res.send(product)];
            }
        });
    }); });
    app.post("/api/products/:id/like", function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var product, result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, productRepository.findOne(req.params.id)];
                case 1:
                    product = _a.sent();
                    product && product.likes++;
                    return [4 /*yield*/, productRepository.save(product)];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, res.send(result)];
            }
        });
    }); });
    console.log("app listening to port:8000");
    app.listen(8000);
})
    .catch(function (err) { return console.log(err); });
