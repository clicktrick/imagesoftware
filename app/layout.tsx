import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Image Software',
  description: 'Upload and manage your model and product images with ease.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100`}>
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-800">Ettora Image Storing Software</h1>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-white border-t mt-12">
          <div className="container mx-auto px-4 py-6 text-center text-gray-600">
            © 2024 Ettora. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  )
}