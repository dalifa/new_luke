import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import './globals.css'
//
const inter = Inter({ subsets: ['latin'] })
const mont = Montserrat({ subsets: ['latin'] })
//
export const metadata: Metadata = {
  title: 'WE Bless You',
  description: 'Plateforme chrétienne de financement participatif par le don. Toutes vos courses, shopping, factures, etc... financés généreusement par votre communauté chrétienne.',
}
//
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={mont.className}>
          <div className="h-full bg-white">
            {children}
          </div>
      </body>
    </html>
  )
}
