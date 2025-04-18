import {http, HttpResponse, PathParams} from 'msw'
import {products, users} from './data'

export const handlers = [
    // Handles GET /api/products
    http.get('/api/products', () => {
        return HttpResponse.json(products)
    }),

    // Handles GET /api/products/:id
    http.get<{ id: string }, PathParams>('/api/products/:id', ({params}) => {
        const product = products.find((p) => p.id === params.id)
        if (!product) {
            return new HttpResponse(null, {status: 404})
        }
        return HttpResponse.json(product)
    }),

    // Handles POST /api/login
    http.post('/api/login', async ({request}) => {
        const info = await request.json()
        // Basic validation (replace with proper validation in a real app)
        // @ts-expect-error
        const user = users.find(u => u.email === info.email && u.password === info.password);

        if (user) {
            // In a real app, you'd return a token or session info
            localStorage.setItem('e-commerce-user', user.id.toString())
            return HttpResponse.json({success: true, userId: user.id})
        }

        return new HttpResponse(JSON.stringify({message: 'Invalid credentials'}), {status: 401})
    }),

    // Handles POST /api/signup
    http.post('/api/signup', async ({request}) => {
        const info = await request.json()
        // Basic validation (replace with proper validation in a real app)
        // In a real app, check if user already exists
        // @ts-expect-error
        const newUser = {id: users.length + 1, name: info.name, email: info.email, password: info.password};
        users.push(newUser);

        // In a real app, you'd return a token or session info
        return HttpResponse.json({success: true, userId: newUser.id}, {status: 201})
    }),
] 