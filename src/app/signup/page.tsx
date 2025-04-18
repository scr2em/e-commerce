'use client'

import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'
import {useState} from 'react'
import {useRouter} from 'next/navigation'
import Link from 'next/link'

// Define the schema for validation, including password confirmation
const signupSchema = z.object({
    name: z.string().min(1, {message: 'Name is required'}),
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string().min(6, {message: 'Password must be at least 6 characters'}),
    confirmPassword: z.string().min(6, {message: 'Please confirm your password'})
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
});

type SignupFormInputs = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        reset,
    } = useForm<SignupFormInputs>({
        resolver: zodResolver(signupSchema),
    });
    const [signupError, setSignupError] = useState<string | null>(null);
    const [signupSuccess, setSignupSuccess] = useState(false);
    const router = useRouter();

    const onSubmit = async (data: SignupFormInputs) => {
        setSignupError(null);
        setSignupSuccess(false);
        try {
            // Don't send confirmPassword to the API
            const {confirmPassword, ...signupData} = data;

            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(signupData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Signup failed');
            }

            const result = await response.json();
            if (result.success) {
                setSignupSuccess(true);
                reset(); // Clear the form
                // In a real app, you might automatically log the user in or redirect to login
                console.log('Signup successful, userId:', result.userId);
                // Redirect to login page after a short delay
                setTimeout(() => {
                    router.push('/login');
                }, 1500);
            } else {
                throw new Error('Signup failed due to server logic');
            }
        } catch (err) {
            setSignupError(err instanceof Error ? err.message : 'An unknown error occurred');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-900">Create Account</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            {...register('name')}
                            className={`mt-1 block w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            placeholder="your name"
                        />
                    </div>
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
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
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
                        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            {...register('confirmPassword')}
                            className={`mt-1 block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            placeholder="••••••••"
                        />
                        {errors.confirmPassword &&
                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
                    </div>

                    {signupError && (
                        <div className="text-sm text-red-600 bg-red-100 p-3 rounded-md">
                            {signupError}
                        </div>
                    )}
                    {signupSuccess && (
                        <div className="text-sm text-green-600 bg-green-100 p-3 rounded-md">
                            Signup successful! Redirecting to login...
                        </div>
                    )}

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting || signupSuccess}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-150 ease-in-out"
                        >
                            {isSubmitting ? 'Creating account...' : 'Sign up'}
                        </button>
                    </div>
                </form>
                <p className="mt-6 text-sm text-center text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
} 