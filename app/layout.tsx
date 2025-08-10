import '../app/globals.css'
import Sidebar from '../components/sidebar'
import Providers from '../components/providers'
import Header from '../components/header' // <-- add this
import { Inter, Playfair_Display } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata = {
  title: 'PolyTrack',
  description: 'A 3D printing material management app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex bg-gray-950 text-gray-100">
        {/* Sidebar stays constant across pages */}
        <Sidebar />

        {/* Right pane: header + page content */}
        <div className="flex-1 flex flex-col">
          <Providers>
            {/* Top bar with AuthButton inside Header (client component) */}
            <Header />
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </Providers>
        </div>
      </body>
    </html>
  )
}
