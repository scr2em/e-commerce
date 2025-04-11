// Server Component
import Link from 'next/link'
import { products } from '@/mocks/data' // Import mock data
import ProductDetailsClient from '@/components/ProductDetailsClient' // Import the client component
import { notFound } from 'next/navigation'; // Import notFound for 404 handling

// Define Product interface (matching the one in the client component)
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface ProductDetailPageProps {
  params: { id: string };
}

// Function to fetch data server-side (can be extracted)
async function getProductById(id: string): Promise<Product | undefined> {
  // In a real app, this would be an API call
  // For now, we find it in the mock data
  await new Promise(resolve => setTimeout(resolve, 50)); // Simulate network delay
  const product = products.find((p) => p.id === id);
  return product;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = params;
  const product = await getProductById(id);

  // Handle product not found on the server
  if (!product) {
    notFound(); // This will render the nearest not-found.tsx file or a default Next.js 404 page
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Link href="/" className="text-indigo-600 hover:underline">
          &larr; Back to Products
        </Link>
      </div>
      {/* Render the client component with the fetched product data */}
      <ProductDetailsClient product={product} />
    </div>
  );
} 