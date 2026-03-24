import './globals.css'
import Header from './components/Header'
import Providers from './components/Providers'

export const metadata = {
  title: 'Stixs 3D Printer Shop',
  description: 'Custom and set 3D prints',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  )
}