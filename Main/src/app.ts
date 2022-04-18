import * as express from "express";
// import { Request, Response } from "express";
import * as cors from "cors";
import { createConnection } from "typeorm";
// import { Product } from "./entity/product";
import * as morgan from "morgan";
import * as amqp from "amqplib/callback_api"

createConnection()
  .then((db) => {

    amqp.connect("amqps://hcmesmrl:OLXTRqJhp_o4_FMaSfc_NhHyvXZ4gHa5@cow.rmq2.cloudamqp.com/hcmesmrl",(error0,connection)=>{
      if(error0){
        throw error0
      }
      connection.createChannel((error1,channel)=>{
        if(error1){
          throw error1
        }
      })
    })
    const app = express();
    app.use(
      cors({
        origin: ["http://localhost:3000"],
      })
    );

    app.use(morgan("combined"));
    app.use(express.json());

    console.log("app listening to port:8001");

    app.listen(8001);
  })
  .catch((err) => console.log(err));
