import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Proper MIME type declarations */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* Preload critical assets with proper types */}
        <link 
          rel="preload" 
          href="/logo/dopelogo.svg" 
          as="image" 
          type="image/svg+xml" 
        />
        <link 
          rel="preload" 
          href="/video/footervid.mp4" 
          as="video" 
          type="video/mp4" 
        />
        
        {/* Manifest with proper type */}
        <link 
          rel="manifest" 
          href="/manifest.json" 
          type="application/manifest+json" 
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}