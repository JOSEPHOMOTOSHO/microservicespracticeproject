"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
require('dotenv').config();
var express = require("express");
var cors = require("cors");
var typeorm_1 = require("typeorm");
var product_1 = require("./entity/product");
var morgan = require("morgan");
var amqp = require("amqplib/callback_api");
var axios_1 = require("axios");
(0, typeorm_1.createConnection)()
    .then(function (db) {
    var productRepository = db.getMongoRepository(product_1.Product);
    amqp.connect(process.env.AMQP_URI, function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }
            channel.assertQueue("product_created", { durable: false });
            channel.assertQueue("product_deleted", { durable: false });
            channel.assertQueue("product_updated", { durable: false });
            var app = express();
            app.use(cors({
                origin: ["http://localhost:3000"],
            }));
            app.use(morgan("combined"));
            app.use(express.json());
            channel.consume("product_created", function (message) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var eventProduct, product;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            eventProduct = JSON.parse(message.content.toString());
                            product = new product_1.Product();
                            product.admin_id = parseInt(eventProduct.id);
                            product.title = eventProduct.title;
                            product.likes = eventProduct.likes;
                            product.image = eventProduct.image;
                            return [4 /*yield*/, productRepository.save(product)];
                        case 1:
                            _a.sent();
                            console.log("product created");
                            return [2 /*return*/];
                    }
                });
            }); }, { noAck: true });
            channel.consume("product_updated", function (message) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var eventProduct, product;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            eventProduct = JSON.parse(message.content.toString());
                            return [4 /*yield*/, productRepository.findOne({ admin_id: parseInt(eventProduct.id) })];
                        case 1:
                            product = _a.sent();
                            productRepository.merge(product, {
                                title: eventProduct.title,
                                image: eventProduct.image,
                                likes: eventProduct.likes
                            });
                            return [4 /*yield*/, productRepository.save(product)];
                        case 2:
                            _a.sent();
                            console.log("product updated");
                            return [2 /*return*/];
                    }
                });
            }); }, { noAck: true });
            channel.consume("product_deleted", function (message) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var admin_id;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            admin_id = parseInt(message.content.toString());
                            return [4 /*yield*/, productRepository.deleteOne({ admin_id: admin_id })];
                        case 1:
                            _a.sent();
                            console.log("product deleted");
                            return [2 /*return*/];
                    }
                });
            }); }, { noAck: true });
            app.get("/api/products", function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var products;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, productRepository.find()];
                        case 1:
                            products = _a.sent();
                            return [2 /*return*/, res.send(products)];
                    }
                });
            }); });
            app.post("/api/products/:id/like", function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var product;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log("maee");
                            return [4 /*yield*/, productRepository.findOne(req.params.id)];
                        case 1:
                            product = _a.sent();
                            return [4 /*yield*/, axios_1.default.post("http://localhost:8000/api/products/".concat(product === null || product === void 0 ? void 0 : product.admin_id, "/like"), {})];
                        case 2:
                            _a.sent();
                            product.likes++;
                            return [4 /*yield*/, productRepository.save(product)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, res.send(product)];
                    }
                });
            }); });
            console.log("Main app listening to port:8001");
            app.listen(8001);
            process.on("beforeExit", function () {
                console.log("Closing connection");
                connection.close();
            });
        });
    });
})
    .catch(function (err) { return console.log(err); });
