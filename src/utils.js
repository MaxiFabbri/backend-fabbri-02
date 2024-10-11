import fs from 'fs';
import config from './config.js';

export const readFile = (fileName) => {
    const fileContent = fs.readFileSync(fileName, 'utf-8');
    return JSON.parse(fileContent);  
}

export const writeFile = async (fileName, content) => {
    try {
        await fs.promises.writeFile(fileName, JSON.stringify(content)); 
    } catch (err) {
        console.log(err)
    } 
}


export const renderProducts = products =>{
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        const productTitle = document.createElement('h4');
        productTitle.textContent = product.title;
        const productCategory = document.createElement('h6');
        productCategory.textContent = `Categoría: ${product.category}`;
        const productDescription = document.createElement('h6');
        productDescription.textContent = `Descripción: ${product.description}`;
        const productPrice = document.createElement('h6');
        productPrice.textContent = `Precio $ ${product.price}`;

        productCard.appendChild(productTitle);
        productCard.appendChild(productCategory);
        productCard.appendChild(productDescription);
        productCard.appendChild(productPrice);

        productsList.appendChild(productCard);
    })  
}

// writeFile("./products.json", productos)

// const productos2 = await readFile("./products.json")
