import { Router } from 'express';
import fs from 'fs';
import {writeFile, readFile} from '../utils.js';

const router = Router();
const PRODFILE = './src/files/products.json';

// Leo los arrays desde archivo mientras lo declaro
const products =  readFile(PRODFILE);

// funciones
const validateString = value =>{
    if (typeof(value)=='string' ) {
        return true;
    } 
    return false ;
};
const validateNumber = value =>{
    if (typeof(value)=='number' ) {
        return true;
    } 
    return false ;
};
const validateBoolean = value =>{
    if (typeof(value)=='boolean' ) {
        return true;
    } 
    return false ;
};

// Middlewares a utilizar
// chequeo que los productos que se carguen tengan todas las propiedades requeridas y que sean del tipo correcto
const checkProduct = (req,res,next) =>{
    if (!req.body.hasOwnProperty('title') || !validateString(req.body.title || req.body.title == "")) {
        return res.status(404).send({ error: 'Error, title is missing or is not a String', data: [] });
    } else if (!req.body.hasOwnProperty('description') || !validateString(req.body.description || req.body.description == "")) {
       return res.status(404).send({ error: 'Error, description is missing or is not a String', data: [] });    
    } else if (!req.body.hasOwnProperty('code') || !validateString(req.body.code || req.body.code == "")) {
        return res.status(404).send({ error: 'Error, code is missing or is not a String', data: [] });
    } else if (!req.body.hasOwnProperty('price') || !validateNumber(req.body.price || req.body.price < 1)) {
        return res.status(404).send({ error: 'Error, price is missing or is not a Number', data: [] });
    } else if (!req.body.hasOwnProperty('stock') || !validateNumber(req.body.stock || req.body.stock < 1)) {
        return res.status(404).send({ error: 'Error, stock is missing or is not a Number', data: [] });
    } else if (!req.body.hasOwnProperty('category') || !validateString(req.body.category || req.body.category == "")) {
        return res.status(404).send({ error: 'Error, is missing or is not a String', data: [] });
    } else if (req.body.hasOwnProperty('status') && !validateBoolean(req.body.status)) {
        return res.status(404).send({ error: 'Error, status is not a Boolean', data: [] });
    };
    next();   
};
// chequeo que el body en los PUT, no contenga id, y si lo contiene, lo borro
const checkId = (req,res,next) =>{
    if (req.body.hasOwnProperty('id')){
        delete req.body.id;
    };
    next();
};
// chequeo en los PUT que la propiedad status este correcta y sino la pongo en false
const checkStatus = (req, res, next) =>{
    if (!req.body.hasOwnProperty('status') || !validateBoolean(req.body.status)) {
        req.body.status = false;
    };
    next();
};
// Leo el archivo products.json y lo traigo al array products
const updateProducts = (req, res, next) =>{
    const products = readFile(PRODFILE);
    next();
};

// Endpoint GET sin parametros o con un Query
router.get('/', updateProducts, (req, res) => {   
    const limit = req.query.limit;
    if(!limit){
        res.status(200).send({ error: null, data: products });
    } else {
        const mostrarProducts = products.slice(0,limit)
        res.status(200).send({ error: null, data: mostrarProducts });
    }
});
// Endpoint GET con params
router.get('/:pid', updateProducts, (req, res) => {
    const id = parseInt(req.params.pid);
    const index = products.findIndex(el => el.id === id);
    if(index > -1) {
        res.status(200).send({ error: null, data: products[index] });
    } else {
        res.status(404).send({ error: 'Dato invalido', data: "" });
    }
});
// Endpoint POST
router.post('/',updateProducts, checkProduct , (req, res) => {

    console.log('Recibido: ',req.body)
    const maxIdProv = Math.max(...products.map(element => +element.id));
    const maxId = maxIdProv < 0 ? 0 : maxIdProv;
    const newProduct = { id: maxId + 1, 
        title: req.body.title, 
        description: req.body.description,
        code: req.body.code,
        price: req.body.price,
        status: req.body.status || true,
        stock: req.body.stock,
        category: req.body.category,
        thumbnails: req.body.thumbnails || []
    };
    products.push(newProduct);
    writeFile(PRODFILE, products)
    res.status(200).send({ error: null, data: newProduct });
});
//  Endpoint PUT con param
router.put('/:pid', updateProducts, checkProduct, checkId, checkStatus, (req, res) => {
    const id = parseInt(req.params.pid);
    const index = products.findIndex(element => element.id === id);
    if (index > -1) {
        products[index] = {"id": id,...req.body};
        res.status(200).send({ error: null, data: products[index] });
    } else {
        res.status(404).send({ error: 'No se encuentra el producto', data: [] });
    }
});
// Endpoint DELETE con param
router.delete('/:pid', updateProducts, (req, res) => {
    const id = parseInt(req.params.pid);
    const index = products.findIndex(element => element.id === id);
    if (index > -1) {
        products.splice(index, 1);
        writeFile(PRODFILE, products)
        res.status(200).send({ error: null, data: 'Producto borrado' });
    } else {
        res.status(404).send({ error: 'No se encuentra el Producto', data: [] });
    }
});


export default router;
