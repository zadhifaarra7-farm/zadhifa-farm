import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Zadhifa Farm | Platform Peternakan Domba Premium',
    description: 'Platform peternakan domba premium dengan teknologi AI. Temukan domba berkualitas untuk Qurban, Aqiqah, dan breeding dengan jaminan kesehatan dan tracking real-time.',
    keywords: ['domba qurban', 'domba aqiqah', 'peternakan domba', 'beli domba online', 'domba premium', 'dorper', 'garut'],
    authors: [{ name: 'Zadhifa Farm' }],
    openGraph: {
        title: 'Zadhifa Farm | Platform Peternakan Domba Premium',
        description: 'Platform peternakan domba premium dengan teknologi AI. Temukan domba ideal Anda.',
        type: 'website',
        locale: 'id_ID',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Zadhifa Farm',
        description: 'Platform Peternakan Domba Premium dengan AI',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="id" className="scroll-smooth">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body className="min-h-screen bg-[#0a0f0d] text-white antialiased noise farm-pattern">
                {children}
            </body>
        </html>
    )
}
