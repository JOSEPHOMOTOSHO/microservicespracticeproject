import * as express from "express";
import { Request, Response } from "express";
import * as cors from "cors";
import { createConnection } from "typeorm";
import { Product } from "./entity/product";
import * as morgan from "morgan";
import * as amqp from "amqplib/callback_api"

createConnection()
  .then((db) => {
    const productRepository = db.getRepository(Product);

    amqp.connect("amqps://hcmesmrl:OLXTRqJhp_o4_FMaSfc_NhHyvXZ4gHa5@cow.rmq2.cloudamqp.com/hcmesmrl",(error0,connection)=>{
      if(error0){
        throw error0
      }

      connection.createChannel((error1,channel)=>{
        if(error1){
          throw error1
        }

        const app = express();
        app.use(
          cors({
            origin: ["http://localhost:3000"],
          })
        );
    
        app.use(morgan("combined"));
        app.use(express.json());
    
        app.get("/api/products", async (req: Request, res: Response) => {
          const products = await productRepository.find();
          res.json(products);
        });
    
        app.post("/api/products", async (req: Request, res: Response) => {
          const product = await productRepository.create(req.body);
          const result = await productRepository.save(product);
          return res.send(result);
        });
    
        app.get("/api/products/:id", async (req: Request, res: Response) => {
          const product = await productRepository.findOne(req.params.id);
          return res.send(product);
        });
    
        app.put("/api/products/:id", async (req: Request, res: Response) => {
          const product = await productRepository.findOne(req.params.id);
          productRepository.merge(product as Product, req.body);
          const result = await productRepository.save(product as Product);
          return res.send(result);
        });
    
        app.delete("/api/products/:id", async (req: Request, res: Response) => {
          const product = await productRepository.delete(req.params.id);
          return res.send(product);
        });
    
        app.post("/api/products/:id/like", async (req: Request, res: Response) => {
          const product = await productRepository.findOne(req.params.id);
          product && product.likes++;
          const result = await productRepository.save(product as Product);
          return res.send(result);
        });
    
        console.log("Admin app listening to port:8000");
    
        app.listen(8000);

      })
    })
  })
  .catch((err) => console.log(err));
