'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useCart} from '@/context/CartContext'

export default function Navbar() {
    const pathname = usePathname();
    const {itemCount} = useCart();
    const isUserAuthenticated = typeof window !== 'undefined' && localStorage.getItem('e-commerce-user') !== null;

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700">
                            E-Commerce Store
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="/"
                              className={`text-gray-600 hover:text-indigo-600 transition duration-150 ease-in-out ${pathname === '/' ? 'font-semibold text-indigo-600' : ''}`}>
                            Home
                        </Link>
                        <Link href="/cart"
                              className="relative text-gray-600 hover:text-indigo-600 transition duration-150 ease-in-out">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                            </svg>
                            {itemCount > 0 && (
                                <span
                                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {itemCount}
                </span>
                            )}
                        </Link>
                        <UserActions isUserAuthenticated={isUserAuthenticated}/>
                    </div>
                </div>
            </div>
        </nav>
    );
}

function UserActions({isUserAuthenticated}: { isUserAuthenticated: boolean }) {
    const pathname = usePathname();
    const onLogOut = () => {
        localStorage.removeItem('e-commerce-user');
    }
    if (!isUserAuthenticated) {
        return <>
            <Link href="/login"
                  className={`px-4 py-2 rounded text-sm font-medium transition duration-150 ease-in-out ${pathname === '/login' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:text-indigo-600'}`}>
                Login
            </Link>
            <Link href="/signup"
                  className={`px-4 py-2 rounded text-sm font-medium transition duration-150 ease-in-out bg-indigo-50 text-indigo-600 hover:bg-indigo-100 ${pathname === '/signup' ? 'ring-2 ring-indigo-300' : ''}`}>
                Sign Up
            </Link>
        </>
    } else {
        return <>
            <Link href='/orders'
                  className={`px-4 py-2 rounded text-sm font-medium transition duration-150 ease-in-out ${pathname === '/orders' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:text-indigo-600'}`}>Your
                orders</Link>
            <a onClick={onLogOut}
               className={`px-4 py-2 rounded text-sm font-medium transition duration-150 ease-in-out bg-indigo-50 text-indigo-600 hover:bg-indigo-100 ${pathname === '/signup' ? 'ring-2 ring-indigo-300' : ''}`}>
                Log out</a>
        </>
    }
}