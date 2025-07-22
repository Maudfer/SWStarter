import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import '../css/styles.css'

const montserrat = Montserrat({ variable: '--font-montserrat', subsets: ['latin'] })

export const metadata: Metadata = {
  title: "SWStarter",
  description: "LawnStarter take-home assignment by Mauricio Fernandes",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable}`}>
        <header className="topbar">
          <h1 className="logo">SWStarter</h1>
        </header>

        <main className="app-wrapper">{children}</main>
      </body>
    </html>
  )
}
