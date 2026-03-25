import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
    orderBy: { updatedAt: 'desc' },
    take: 3
  })

  return (
    <main className="bg-gray-100 min-h-screen">

      {/* HERO SECTION */}
      <section className="bg-black text-white text-center py-20">
        <h1 className="text-5xl font-bold mb-4">Stixs 3D Printing</h1>
        <p className="text-lg mb-6">Custom 3D prints made to order</p>
        <a href="/products" className="bg-white text-black px-6 py-2 rounded inline-block">
          Shop Now
        </a>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="p-10">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Featured Products
        </h2>

        {featuredProducts.length === 0 ? (
          <p className="text-center text-gray-600">No featured products yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`} className="block">
                <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-[42rem] object-cover rounded mb-4"
                    />
                  ) : (
                    <div className="w-full h-[42rem] bg-gray-300 rounded mb-4 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">No image</span>
                    </div>
                  )}
                  <h3 className="text-xl font-semibold">{product.title}</h3>
                  <p>${Number(product.price).toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ABOUT SECTION */}
      <section className="bg-white p-10 text-center">
        <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
        <p className="max-w-xl mx-auto">
          We create high-quality custom 3D prints with fast turnaround times.
          Perfect for gifts, prototypes, and unique designs.
        </p>
      </section>

      {/* CTA SECTION */}
      <section className="bg-black text-white text-center py-16">
        <h2 className="text-3xl font-bold mb-4">
          Have a custom idea?
        </h2>
        <p className="mb-6">Let’s bring it to life</p>
        <Link href="/contact" className="bg-white text-black px-6 py-2 rounded inline-block">
          Contact Us
        </Link>
      </section>

    </main>
  );
}