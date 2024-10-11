import { Server } from 'socket.io';



const initSocket = (httpServer) => {
    const products = []
    
    const io = new Server(httpServer);
    console.log('Servicio socket.io activo');
    
    io.on('connection', client => {
        console.log(`Cliente conectado, id ${client.id} desde ${client.handshake.address}`);

        // Servicio que escucha a los clientes cuando envian un nuevo producto
        /*client.on('new_product', data => {
            products.push(data)
            console.log('new_product')

            client.emit('product_list',products)
        })*/


        client.on('disconnect', reason => {
            console.log('Cierre de conexion: ',reason);
        });
    });
    return io;
}
export default initSocket;

// Suscripción al tópico new_product
/*client.on('new_product', data => {
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
});*/
