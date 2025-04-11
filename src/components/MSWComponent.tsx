'use client'

import { useEffect } from 'react'

async function initMSW() {
  // Check if we are in a browser environment
  if (typeof window !== 'undefined') {
    // Initialize MSW only in development mode
    if (process.env.NODE_ENV === 'development') {
      // Dynamically import the MSW worker setup
      const { worker } = await import('@/mocks/browser')
      // Start the worker
      await worker.start({
        // Optional: Prevents MSW from printing request logs in the console
        // quiet: true,
        // Optional: Define the scope for the service worker
        // serviceWorker: {
        //   url: '/mockServiceWorker.js'
        // }
      })
      console.log('MSW initialized');
    }
  }
}

// This component initializes MSW when mounted on the client side.
export default function MSWComponent() {
  useEffect(() => {
    // We only want to initialize MSW once.
    // Checking if the worker is already running might be more robust,
    // but for this simple setup, calling initMSW in useEffect is sufficient.
    initMSW()
  }, [])

  // This component does not render anything visible in the DOM.
  return null
} 