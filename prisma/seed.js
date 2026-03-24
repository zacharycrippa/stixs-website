const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword'
  const hashedPassword = await bcrypt.hash(adminPassword, 10)
  
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    },
  })
  
  console.log('Admin user created:', admin)

  // Seed products
  const products = [
    {
      title: 'Caravan Scoop',
      slug: 'caravan-scoop',
      description: 'A fun and functional scoop for your caravan adventures.',
      price: 25.00,
      stock: 10,
      image: '/caravan-scoop.jpg'
    },
    {
      title: 'Custom Print',
      slug: 'custom-print',
      description: 'Personalized 3D printed items tailored to your design.',
      price: 50.00,
      stock: 5,
      image: '/custom-print.jpg'
    },
    {
      title: 'Giraffe Fidget Toy',
      slug: 'giraffe-fidget-toy',
      description: 'A cute giraffe-shaped fidget toy for stress relief.',
      price: 15.00,
      stock: 20,
      image: '/giraffe-fidget-toy.jpg'
    },
    {
      title: 'Phone Stand',
      slug: 'phone-stand',
      description: 'Adjustable 3D printed phone stand for desk or car.',
      price: 20.00,
      stock: 15,
      image: '/phone-stand.jpg'
    }
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product
    })
  }

  console.log('Products seeded')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })