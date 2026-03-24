export default function Home() {
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Product 1 */}
          <a href="/products/caravan-scoop" className="block">
            <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
              <div className="h-40 bg-gray-300 mb-4"></div>
              <h3 className="text-xl font-semibold">Caravan Scoop</h3>
              <p>$350</p>
            </div>
          </a>

          {/* Product 2 */}
          <a href="/products/giraffe-fidget-toy" className="block">
            <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
              <div className="h-40 bg-gray-300 mb-4"></div>
              <h3 className="text-xl font-semibold">Giraffe Fidget Toy</h3>
              <p>$9.99</p>
            </div>
          </a>

          {/* Product 3 */}
          <a href="/products/custom-print" className="block">
            <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
              <div className="h-40 bg-gray-300 mb-4"></div>
              <h3 className="text-xl font-semibold">Custom Print</h3>
              <p>From $10</p>
            </div>
          </a>
        </div>
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
        <button className="bg-white text-black px-6 py-2 rounded">
          Contact Us
        </button>
      </section>

    </main>
  );
}