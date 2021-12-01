import express, {Request, Response} from 'express';
import Produit from "./produit";
import bodyParser from "body-parser";
import serveStatic from "serve-static";
import mongoose from "mongoose";
import cors from "cors";
const swaggerUi = require("swagger-ui-express"),
swaggerDocument = require("../swagger.json");
/* Instancier Express */
const app=express();
/* Middleware bodyParser pour parser le corps des requêtes en Json*/
app.use(bodyParser.json());
/* Middlware pour configurer le dossier des ressources statique*/
app.use(serveStatic("public"));
/* Actvier CORS*/
app.use(cors());
/* Connection à MongoDb*/
const uri:string="mongodb://localhost:27017/crudproduit";
mongoose.connect(uri,(err)=>{
    if(err){	console.log(err);	}
    else{ console.log("Mongo db connection sucess");	}
});

/* Requête HTTP GET http://localhost:8700/ */
app.get("/",(req:Request,resp:Response)=>{  resp.send(" CHVDLI  ©  21");
});

/* Requête HTTP GET AlL  http://localhost:8700/produit */
app.get("/produits",(req:Request,resp:Response)=>{
    Produit.find((err,produit)=>{
    if(err){ resp.status(500).send(err); }
    else{ resp.send(produit);	}
})
});
/* Requête HTTP POST http://localhost:8700/produits */
app.post("/produits",(req:Request,resp:Response)=>{
    let produit=new Produit(req.body);  produit.save(err=>{
    if (err) resp.status(500).send(err);
    else resp.send(produit);
})
});
/* Requête HTTP GET http://localhost:8700/produits/id */
app.get("/produits/:id",(req:Request,resp:Response)=>{
    // @ts-ignore
    Produit.findById(req.params.id,(err,produit)=>{
    if(err){ resp.status(500).send(err); }
    else{ resp.send(produit);	}
});
});
/* Requête HTTP PUT http://localhost:8700/produits/id */
app.put("/produits/:id",(req:Request,resp:Response)=>{
    // @ts-ignore
    Produit.findByIdAndUpdate(req.params.id,req.body,(err,produit)=>{
    if (err) resp.status(500).send(err);
    else{
        resp.send("Successfuly updated produit");
    }
})
});
/* Requête HTTP DELETE http://localhost:8700/produits/id */
app.delete("/produits/:id",(req:Request,resp:Response)=>{  Produit.deleteOne({_id:req.params.id},err=>{
    if(err) resp.status(500).send(err);
    else resp.send("Successfuly deleted Produit");
});
});
/* Requête HTTP GET http://localhost:8700/pproduit?page=0&size=5 */
app.get("/pproduit",(req:Request,resp:Response)=>{  // @ts-ignore
    let p:number=parseInt(req.query.page || 1);  let size:number=parseInt(req.query.size || 5);
    Produit.paginate({}, { page: p, limit: size }, function(err, result) {
        if(err) resp.status(500).send(err);
        else resp.send(result);
    });
});
/* Requête HTTP GET http://localhost:8700/produits-serach?kw=J&page=0&size=5 */
app.get("/produits-serach",(req:Request,resp:Response)=>{
    // @ts-ignore
    let p:number=parseInt(req.query.page || 1);  let size:number=parseInt(req.query.size || 5);  let keyword:string=req.query.kw || '';
    Produit.paginate({title:{$regex:".*(?i)"+keyword+".*"}}, { page: p, limit:  size }, function(err, result) {
        if(err) resp.status(500).send(err);
        else resp.send(result);
    });
});

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);
/* Démarrer le serveur*/
app.listen(8700,()=>{
    console.log("Server Started on port %d",8700);
});

