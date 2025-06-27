import type React from "react"
import { ImoveisProvider } from "@/contexts/imoveis-context"


export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode
  }>) {
    return (
      <html lang="pt-BR">
        <body>
          <ImoveisProvider>{children}</ImoveisProvider>
        </body>
      </html>
    )
  }