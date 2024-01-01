import Head from 'next/head';
import { DefaultSeo } from 'next-seo';
import PlausibleProvider, { } from 'next-plausible'
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import theme from '../theme';
import createEmotionCache from '../createEmotionCache';
import { useState } from 'react'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  // Create a new supabase browser client on every first render.
	return (
		<PlausibleProvider trackOutboundLinks domain={process.env.NEXT_PUBLIC_DOMAIN || ''}>
			<CacheProvider value={emotionCache}>
          <Head>
            <meta name="viewport" content="initial-scale=1, width=device-width" />
          </Head>
          <DefaultSeo
            openGraph={{
              type: 'website',
              locale: 'en_US',
              url: 'https://remnant2gear.com',
              siteName: 'Remnant 2 Gear',
              title: 'Remnant 2 Gear',
              description: 'A gear filter for Remant 2',
              images: [
                {
                  url: `https://${process.env.NEXT_PUBLIC_DOMAIN}/android-chrome-512x512.png`,
                  width: 512,
                  height: 512,
                  alt: 'R2G',
                },
              ]
            }}
          />
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
			</CacheProvider>
		</PlausibleProvider>
  );
}
