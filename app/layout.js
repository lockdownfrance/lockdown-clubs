export const metadata = {
  title: 'LOCKDOWN FRANCE — Clubs',
  description: 'Tous les clubs de football américain en France',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700;800;900&family=DM+Mono:wght@300;400;500&family=Unbounded:wght@300;400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{margin:0,padding:0,background:'#06080A',color:'#E8EDF5',fontFamily:"'DM Mono',monospace"}}>{children}</body>
    </html>
  )
}
