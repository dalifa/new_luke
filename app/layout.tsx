import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import './globals.css'
//
const inter = Inter({ subsets: ['latin'] })
const mont = Montserrat({ subsets: ['latin'] })
//
export const metadata: Metadata = {
  title: 'Tripl',
  description: 'Don participatif entre particuliers.',
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
