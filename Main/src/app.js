"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
// import { Request, Response } from "express";
var cors = require("cors");
var typeorm_1 = require("typeorm");
// import { Product } from "./entity/product";
var morgan = require("morgan");
var amqp = require("amqplib/callback_api");
(0, typeorm_1.createConnection)()
    .then(function (db) {
    amqp.connect("amqps://hcmesmrl:OLXTRqJhp_o4_FMaSfc_NhHyvXZ4gHa5@cow.rmq2.cloudamqp.com/hcmesmrl", function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }
        });
    });
    var app = express();
    app.use(cors({
        origin: ["http://localhost:3000"],
    }));
    app.use(morgan("combined"));
    app.use(express.json());
    console.log("app listening to port:8001");
    app.listen(8001);
})
    .catch(function (err) { return console.log(err); });
