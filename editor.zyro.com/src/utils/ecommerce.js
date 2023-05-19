export const getFilteredProductsByCategoryId = (products, categoryId) => products
    .filter((product) => product.product_collections.some(
        (category) => category.collection_id === categoryId,
    ))
    .sort((a, b) => {
        const resolveOrder = (product) => {
            const index = product.product_collections
                .findIndex((item) => item.collection_id === categoryId);

            return Number(product.product_collections[index].order);
        };

        return resolveOrder(a) >= resolveOrder(b) ? 1 : -1;
    });