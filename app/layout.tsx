import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import './globals.css'
import ActivityTracker from '@/components/auth/activity-tracker'
//
const inter = Inter({ subsets: ['latin'] })
const mont = Montserrat({ subsets: ['latin'] })
//
export const metadata: Metadata = {
  title: 'Luke 6:38 App',
  description: 'Plateforme chrétienne de financement participatif par le don. Toutes vos courses, shopping, factures, etc... financés généreusement par la communauté.',
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
        {/* <ActivityTracker> */}
          <div className="h-full bg-white">
            {children}
          </div>
        {/* </ActivityTracker> */}
      </body>
    </html>
  )
}


{/*
  avant le 03/02/25
  <html lang="en">
      <body className={mont.className}>
        <div className="h-full bg-white">
          {children}
        </div>
      </body>
    </html>
*/}