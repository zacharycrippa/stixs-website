import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Providers from './components/Providers'

export const metadata = {
  title: 'Stixs 3D Printer Shop',
  description: 'Custom and set 3D prints',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Providers>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}