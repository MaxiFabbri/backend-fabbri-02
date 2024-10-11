import { Router } from 'express';
import {writeFile, readFile} from '../utils.js';

const router = Router();
const PRODFILE = './src/files/products.json';
const CARTSFILE = './src/files/carts.json';
const carts = readFile(CARTSFILE);
const products = readFile(PRODFILE);


// middlewares pra chequeos
const checkCid = (req,res,next) =>{
    const carts = readFile(CARTSFILE);
    if (!carts.some(cart => cart.id == parseInt(req.params.cid))){
        res.status(404).send({ error: 'Cart Id Invalido', data: "" });
    } else {
    next()
    }
}
const checkPid = (req,res,next) =>{
    const products = readFile(PRODFILE);
    if (!products.some(prod => prod.id == parseInt(req.params.pid))){
        res.status(404).send({ error: 'Product Id Invalido', data: "" });
    } else {
    next()
    }
}

// Endpoint GET con params
router.get('/:cid', checkCid, (req, res) => {
    const id = parseInt(req.params.cid);
    const index = carts.findIndex(el => el.id === id);
    if(index > -1) {
        res.status(200).send({ error: null, data: carts[index] });
    } else {
        res.status(404).send({ error: 'Dato invalido', data: "" });
    }
});

// Endpoint POST para crear nuevo cart
router.post('/', (req, res) => {
    const carts = readFile(CARTSFILE);
    const maxIdProv = Math.max(...carts.map(element => +element.id));
    const maxId = maxIdProv < 0 ? 0 : maxIdProv;
    const newCart = { 
        id: maxId + 1,
        products: []
    };
    carts.push(newCart);
    writeFile(CARTSFILE, carts)
    res.status(200).send({ error: null, data: newCart });
});

// Endpoint POST para cargar productos al cart
router.post('/:cid/product/:pid', checkCid, checkPid, (req, res) => {
    const cIndex = carts.findIndex(arr => arr.id === parseInt(req.params.cid));
    const pIndex = carts[cIndex].products.findIndex(arr => arr.id == req.params.pid);

    if(pIndex > -1){
        carts[cIndex].products[pIndex].quantity++;
    } else {
        const newProd = {id: req.params.pid, quantity: 1};
        carts[cIndex].products.push(newProd);
    }
    writeFile(CARTSFILE, carts)
    res.status(200).send({ error: null, data: "producto agregado al carro" });
});



export default router;
