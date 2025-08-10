import type React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat, Roboto_Mono } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { NfcButton } from "@/components/nfc-button"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const montserrat = Montserrat({ subsets: ["latin"], weight: "700", variable: "--font-montserrat" })
const robotoMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-roboto-mono" })

export const metadata: Metadata = {
  title: "PolyTrack - Smart 3D Printing Inventory",
  description: "A smart inventory manager for 3D printing materials like filament and resin.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={cn("min-h-screen font-sans antialiased", inter.variable, montserrat.variable, robotoMono.variable)}
      >
        <div className="flex min-h-screen w-full">
          <Sidebar />
          <div className="flex flex-1 flex-col">
            <Header />
            <main className="flex-1 p-4 md:p-6 lg:p-8 bg-poly-white dark:bg-poly-dark/60">{children}</main>
          </div>
        </div>
        <NfcButton />
        <Toaster />
      </body>
    </html>
  )
}
