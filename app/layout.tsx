import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/providers/toast-provider'
import Navbar from '@/components/nav/navbar'
import Footer from '@/components/nav/footer'


const inter = Inter({ subsets: ['latin'] })
const mont = Montserrat({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Luke 6:38 App',
  description: 'Plateforme chrétienne de financement participatif par le don. Toutes vos courses, shopping, factures, etc... financés généreusement par la communauté.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={mont.className}>
        <Navbar/>
        <ToastProvider />
        {children}
      </body>
    </html>
  )
}
