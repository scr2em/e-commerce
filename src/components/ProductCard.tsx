'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCart, CartItem } from '@/context/CartContext'

// Define Product prop type (could be imported from a shared types file later)
interface Product extends Omit<CartItem, 'quantity'> {}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation when clicking button
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000); // Reset feedback after 2 seconds
  };

  return (
    <div className="border border-gray-100  rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white flex flex-col">
      <Link href={`/products/${product.id}`} className="block group flex-grow ">
          <div className="relative overflow-hidden">
             <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" 
             />
          </div>
          <div className="p-4 flex flex-col flex-grow">
            <h2 className="text-lg font-semibold mb-2 truncate group-hover:text-indigo-600 flex-grow" title={product.name}>{product.name}</h2>
            {/* Ensure consistent height for description */}
            {/* <p className="text-gray-600 text-sm mb-2 h-10 overflow-hidden text-ellipsis" title={product.description}>{product.description}</p> */}
            <p className="text-xl font-bold text-indigo-600 mt-2">${product.price.toFixed(2)}</p>
          </div>
      </Link>
      <div className="p-4 pt-0 mt-auto"> {/* Add padding top 0 to separate button */}
        <button 
            onClick={handleAddToCart}
            disabled={added}
            className={`w-full py-2 px-4 rounded-lg font-semibold transition duration-200 text-sm ${added ? 'bg-green-100 text-green-700 cursor-not-allowed' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700'}`}
          >
            {added ? 'Added!' : 'Add to Cart'}
          </button>
      </div>
    </div>
  );
} 