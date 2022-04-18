require('dotenv').config()
import * as express from "express";
import { Request, Response } from "express";
import * as cors from "cors";
import { createConnection } from "typeorm";
import { Product } from "./entity/product";
import * as morgan from "morgan";
import * as amqp from "amqplib/callback_api"
import axios from "axios"

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

        channel.consume("product_updated", async (message) => {
          const eventProduct:Product = JSON.parse(message!.content.toString())
          const product = await productRepository.findOne({admin_id: parseInt(eventProduct.id)})
          productRepository.merge(product as Product, {
            title:eventProduct.title,
            image:eventProduct.image,
            likes:eventProduct.likes
          })
          await productRepository.save(product as Product)
          console.log("product updated")
        },{noAck:true})

        channel.consume("product_deleted", async (message) => {
          const admin_id = parseInt(message!.content.toString())
          await productRepository.deleteOne({admin_id})
          console.log("product deleted")
        },{noAck:true})

        app.get("/api/products", async(req:Request, res:Response)=> {
          const products = await productRepository.find()
          return res.send(products)
        })

        app.post("/api/products/:id/like", async(req:Request, res:Response)=>{
          console.log("maee")
          const product = await productRepository.findOne(req.params.id)
          await axios.post(`http://localhost:8000/api/products/${product?.admin_id}/like`,{})
          product!.likes++
          await productRepository.save(product as Product)
          return res.send(product)
        })
    
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
