'use client'

import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'
import {useState} from 'react'
import {useRouter} from 'next/navigation'
import Link from 'next/link'

// Define the schema for validation using Zod
const loginSchema = z.object({
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string().min(6, {message: 'Password must be at least 6 characters'}),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        reset,
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
    });
    const [loginError, setLoginError] = useState<string | null>(null);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const router = useRouter();

    const onSubmit = async (data: LoginFormInputs) => {
        setLoginError(null);
        setLoginSuccess(false);
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const result = await response.json();
            if (result.success) {
                setLoginSuccess(true);
                reset();
                console.log('Login successful, userId:', result.userId);
                setTimeout(() => {
                    router.push('/');
                }, 1500);
            } else {
                throw new Error('Login failed due to server logic');
            }
        } catch (err) {
            setLoginError(err instanceof Error ? err.message : 'An unknown error occurred');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-900">Login</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...register('email')}
                            className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            placeholder="you@example.com"
                        />
                        {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            {...register('password')}
                            className={`mt-1 block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
                    </div>
                    {loginError && (
                        <div className="text-sm text-red-600 bg-red-100 p-3 rounded-md">
                            {loginError}
                        </div>
                    )}
                    {loginSuccess && (
                        <div className="text-sm text-green-600 bg-green-100 p-3 rounded-md">
                            Login successful! Redirecting...
                        </div>
                    )}
                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting || loginSuccess}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-150 ease-in-out"
                        >
                            {isSubmitting ? 'Logging in...' : 'Log in'}
                        </button>
                    </div>
                </form>
                <p className="mt-6 text-sm text-center text-gray-600">
                    Don't have an account?{' '}
                    <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
} 