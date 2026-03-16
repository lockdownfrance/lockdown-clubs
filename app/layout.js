export const metadata = {
  title: 'LOCKDOWN FRANCE — Le hub du football américain en France',
  description: 'La première plateforme française dédiée au football américain. Scores, clubs, joueurs, équipement.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700;800;900&family=Barlow:ital,wght@1,900&family=DM+Mono:wght@300;400;500&family=Unbounded:wght@300;400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{margin:0,padding:0,background:'#080808',color:'#F4F4F4',fontFamily:"'DM Mono',monospace"}}>{children}</body>
    </html>
  )
}
