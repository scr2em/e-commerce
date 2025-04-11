import { products } from '@/mocks/data' // Import mock data directly
import ProductCard from '@/components/ProductCard' // Import the new client component

// Define Product interface (can be moved to a types file later)
interface Product {
  id: string;
  name: string;
  description: string; // Keep description for potential use, though not shown on card now
  price: number;
  imageUrl: string;
}

// Mark component as async (good practice for Server Components)
export default async function HomePage() {
  // Data is fetched/imported directly on the server
  const fetchedProducts: Product[] = products;

  // No need for loading or error states here as data fetching is synchronous/server-side

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Featured Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {fetchedProducts.map((product) => (
          // Render the ProductCard component for each product
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
