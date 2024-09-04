import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gratigram: University Gratitude Board',
  icons: {
    icon: '/gratigram-favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}