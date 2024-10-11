import { Router } from 'express';
// import { users } from '../config.js';


const router = Router();

router.get('/products', (req, res) => {
    const data = {};
    
    res.status(200).render('products', data);
});
router.get('/realtimeproducts', (req, res) => {
    const data = {};
    
    res.status(200).render('realTimeProducts', data);
});


export default router;