require('dotenv').config()
import * as express from "express";
// import { Request, Response } from "express";
import * as cors from "cors";
import { createConnection } from "typeorm";
import { Product } from "./entity/product";
import * as morgan from "morgan";
import * as amqp from "amqplib/callback_api"

createConnection()
  .then((db) => {

    const productRepository = db.getMongoRepository(Product)

    amqp.connect(process.env.AMQP_URI as string,(error0,connection)=>{
      if(error0){
        throw error0
      }
      connection.createChannel((error1,channel)=>{
        if(error1){
          throw error1
        }
        channel.assertQueue("product_created", {durable:false})
        channel.assertQueue("product_deleted", {durable:false})
        channel.assertQueue("product_updated", {durable:false})
        const app = express();
        app.use(
          cors({
            origin: ["http://localhost:3000"],
          })
        );
    
        app.use(morgan("combined"));
        app.use(express.json());

        channel.consume("product_created", async (message)=>{
          const eventProduct:Product = JSON.parse(message!.content.toString())
          const product = new Product()
          product.admin_id = parseInt(eventProduct.id)
          product.title = eventProduct.title
          product.likes = eventProduct.likes
          product.image = eventProduct.image
          await productRepository.save(product)
          console.log("product created")
        },{noAck:true})
    
        console.log("Main app listening to port:8001");
    
        app.listen(8001);
        process.on("beforeExit", ()=>{
          console.log("Closing connection")
          connection.close()
        })
      })

    })

  })
  .catch((err) => console.log(err));
