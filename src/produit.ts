import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate";
/*
idProduit : number;
nomProduit : string;
prixProduit : number;
dateCreation : Date ;
 */
let produitSchema=new mongoose.Schema({
    idProduit:{type:Number,required:true,unique: true},
    nomProduit:{type:String,required:true },
    prixProduit:{type: Number, required: true,default: 0},
    dateCreation:{type: Date, required: true,default: new Date()},

});

produitSchema.plugin(mongoosePaginate);

const Produit=mongoose.model("Produit",produitSchema);

export default Produit;
