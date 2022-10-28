import React from 'react';
import Link from 'next/link';
import ModuleProductActions from '~/components/elements/products/modules/ModuleProductActions';
import useProduct from '~/hooks/useProduct';
import Rating from '~/components/elements/Rating';

const Product = ({ product, viewMOdule = true }) => {
    const { thumbnailImage, price, title } = useProduct();
    return (
        <div className="ps-product">
            <div className="ps-product__thumbnail">
                <Link href="/product/[pid]" as={`/product/${product.id}`}>
                    <a>{thumbnailImage(product)}</a>
                </Link>
                {viewMOdule && <ModuleProductActions product={product} />}
            </div>
            <div className="ps-product__container">
                <Link href="/shop">
                    <a className="ps-product__vendor">{product.shopName}</a>
                </Link>
                <div className="ps-product__content">
                    {title(product)}
                    <div className="ps-product__rating">
                        <Rating />
                        <span>02</span>
                    </div>
                    {price(product)}
                </div>
                <div className="ps-product__content hover">
                    {title(product)}
                    {price(product)}
                </div>
            </div>
        </div>
    );
};

export default Product;
