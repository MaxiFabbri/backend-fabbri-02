import { Server } from 'socket.io';
import config from './config.js';
import {writeFile, readFile} from './utils.js';


const PRODFILE = './src/files/products.json';
let products = []
const getProducts = async () => {
    try {
        const data = await readFile(PRODFILE);
        products = data;
        //console.log("data leida de archivo: ",products)
    } catch (error) {
        console.error('Hubo un problema con tu fetch operación:', error);
    }
}

const initSocket = (httpServer) => {
    
    const io = new Server(httpServer);
    console.log('Servicio socket.io activo');
    
    io.on('connection', async client => {
        console.log(`Cliente conectado, id ${client.id} desde ${client.handshake.address}`);
        await getProducts()
        client.emit('products_list', products)    
            // Suscripción al tópico new_connection (que envía un cliente cuando se conecta)
            client.on('new_connection', data => {
                // Envía a ESE cliente la lista actual de Productos
                client.emit('products_list', products) 
            });

            // Suscripción al tópico new_product
            client.on('new_product', data => {
                const pushProducts = async () => {
                    try {
                        const response = await fetch('http://localhost:5050/api/products/');
                        const oldProducts = await response.json();
                        const products = await oldProducts.data
                        const maxIdProv = Math.max(...products.map(element => +element.id));
                        const maxId = maxIdProv < 0 ? 0 : maxIdProv;
                        const newProduct = { id: maxId + 1, 
                            title: data.title, 
                            description: data.description,
                            code: data.code,
                            price: data.price,
                            status: data.status || true,
                            stock: data.stock,
                            category: data.category,
                            thumbnails: data.thumbnails || []
                        };
                        products.push(newProduct);
                        writeFile(PRODFILE, products)
                        client.emit('products_list', products)
                    } catch (error) {
                        console.error('Hubo un problema con tu fetch operación:', error);
                    }
                }
                pushProducts()
            });
            
            client.on('disconnect', reason => {
                console.log('Cierre de conexion: ',reason);
            });
        });

    return io;
}
export default initSocket;