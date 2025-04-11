'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useCart, CartItem } from '@/context/CartContext'

// Use CartItem definition, assuming product passed has same structure
// And add back the description field
interface Product extends Omit<CartItem, 'quantity'> {
    description: string;
}

interface ProductDetailsClientProps {
  product: Product;
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const { addToCart, removeFromCart, getItemQuantity } = useCart();
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Get current quantity of this specific product in the cart
  const quantityInCart = useMemo(() => getItemQuantity(product.id), [getItemQuantity, product.id]);

  const showFeedback = (message: string) => {
    setFeedbackMessage(message);
    setTimeout(() => setFeedbackMessage(null), 2000); // Clear feedback after 2 seconds
  };

  const handleAddToCart = () => {
    addToCart(product);
    showFeedback('Added to Cart!');
  };

  const handleRemoveFromCart = () => {
    removeFromCart(product.id);
    showFeedback('Removed from Cart');
  };

  return (
    <div className="md:flex md:gap-8">
      <div className="md:w-1/2 mb-6 md:mb-0">
        <img src={product.imageUrl} alt={product.name} className="w-full h-auto rounded-lg shadow-md object-cover max-h-[500px]" />
      </div>
      <div className="md:w-1/2 flex flex-col">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="text-gray-700 mb-6 text-lg flex-grow">{product.description}</p>
        <p className="text-4xl font-extrabold text-indigo-600 mb-6">${product.price.toFixed(2)}</p>
        
        <div className="mt-auto"> {/* Container for button and feedback */}
          {quantityInCart === 0 ? (
            <button 
              onClick={handleAddToCart}
              disabled={!!feedbackMessage} // Disable while feedback is shown
              className={`w-full py-3 px-6 rounded-lg font-semibold transition duration-300 text-lg ${feedbackMessage ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white`}
            >
              Add to Cart
            </button>
          ) : (
            <div className="flex items-center space-x-3">
               <button 
                onClick={handleRemoveFromCart}
                disabled={!!feedbackMessage}
                className={`px-4 py-2 rounded-lg font-semibold transition duration-300 text-lg ${feedbackMessage ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'} text-white text-sm`}
              >
                -
              </button>
              <span className="text-lg font-medium">{quantityInCart} in cart</span>
              <button 
                onClick={handleAddToCart} // Add another instance
                disabled={!!feedbackMessage}
                className={`px-4 py-2 rounded-lg font-semibold transition duration-300 text-lg ${feedbackMessage ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} text-white text-sm`}
              >
                +
              </button>
            </div>
          )}
          {/* Feedback Message Area */}
          {feedbackMessage && (
             <p className="mt-2 text-sm text-center font-medium text-green-600">{feedbackMessage}</p>
          )}
        </div>

      </div>
    </div>
  );
} 