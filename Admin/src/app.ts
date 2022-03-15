import * as express from "express";
import { Request, Response } from "express";
import * as cors from "cors";
import { createConnection } from "typeorm";
import { Product } from "./entity/product";
import * as morgan from "morgan"

createConnection().then((db) => {

    const productRepository = db.getRepository(Product);

    const app = express();
    app.use(
      cors({
        origin: ["http://localhost:3000"],
      })
    );
    
    app.use(morgan('combined'));
    app.use(express.json());

    app.get("/api/products", async (req: Request, res: Response) => {
      const products = await productRepository.find();
      res.json(products);
    });

    app.post("/api/products",  async (req: Request, res: Response) => {
        const product = await productRepository.create(req.body);
        const result = await productRepository.save(product)
        return res.send(result);
    })

    app.get("/api/products/:id",  async (req: Request, res: Response) => {
        const product = await productRepository.findOne(req.params.id);
        return res.send(product);
        
    })

    app.put("/api/products/:id",  async (req: Request, res: Response) => {
        const product = await productRepository.findOne(req.params.id);
        productRepository.merge(product as Product,req.body);
        const result = await productRepository.save(product as Product)
        return res.send(result);
        
    })


    app.delete("/api/products/:id",  async (req: Request, res: Response) => {
        const product = await productRepository.delete(req.params.id);
        return res.send(product);
        
    })

    app.post("/api/products/:id/like",  async (req: Request, res: Response) => {
        const product = await productRepository.findOne(req.params.id);
        product && product.likes++
        const result = await productRepository.save(product as Product)
        return res.send(result);
        
    })

    console.log("app listening to port:8000");

    app.listen(8000);
  })
  .catch((err) => console.log(err));
