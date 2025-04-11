'use client'

import { useCart, CartItem } from "@/context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { cartItems, itemCount, totalQuantity, addToCart, removeFromCart } = useCart();

  const totalCost = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleIncreaseQuantity = (item: Omit<CartItem, 'quantity'>) => {
      addToCart(item);
  };

  const handleDecreaseQuantity = (itemId: string) => {
      removeFromCart(itemId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})</h1>
      {itemCount === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600 mb-4">Your cart is empty.</p>
          <Link href="/" className="text-indigo-600 hover:underline font-semibold">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <ul className="space-y-6">
              {cartItems.map((item) => (
                <li key={item.id} className="flex items-center border-b pb-6">
                  <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded mr-4 flex-shrink-0" />
                  <div className="flex-grow mr-4">
                    <Link href={`/products/${item.id}`} legacyBehavior>
                        <a className="font-semibold text-lg hover:text-indigo-600">{item.name}</a>
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">Unit Price: ${item.price.toFixed(2)}</p>
                    <div className="flex items-center mt-2 space-x-2">
                      <button 
                        onClick={() => handleDecreaseQuantity(item.id)}
                        className="px-2 py-1 rounded border border-gray-300 hover:bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <span className="font-medium w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => handleIncreaseQuantity({id: item.id, name: item.name, price: item.price, imageUrl: item.imageUrl})}
                        className="px-2 py-1 rounded border border-gray-300 hover:bg-gray-100 text-gray-700"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                    <button 
                      onClick={() => handleDecreaseQuantity(item.id)} 
                      className="text-xs text-red-500 hover:text-red-700 mt-1"
                      title="Remove item"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-1">
            <div className="bg-gray-100 p-6 rounded-lg shadow sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <span>Subtotal ({totalQuantity} {totalQuantity === 1 ? 'item' : 'items'})</span>
                <span>${totalCost.toFixed(2)}</span>
              </div>
              {/* Add shipping, tax estimates later */}
              <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                <span>Total</span>
                <span>${totalCost.toFixed(2)}</span>
              </div>
              <button className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 