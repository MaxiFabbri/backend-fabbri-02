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

