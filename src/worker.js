// src/index.js
// This is the main Cloudflare Worker script.
// It uses `@cloudflare/kv-asset-handler` to serve static assets
// from the 'dist' directory (which is specified in wrangler.jsonc).
// It also provides a fallback for routes not found as static assets.

// Import the necessary handler for serving static assets.
// This package is specifically designed for Workers to serve files
// that have been uploaded via the 'assets' configuration in wrangler.jsonc.
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

// Listen for incoming requests (fetch events).
// Every HTTP request hitting your Worker will trigger this event listener.
addEventListener('fetch', event => {
  event.respondWith(handleEvent(event));
});

// Main request handler function.
async function handleEvent(event) {
  try {
    // Attempt to serve a static asset from the 'dist' directory.
    // getAssetFromKV automatically handles:
    // - Looking for the requested file path in the uploaded assets.
    // - Setting appropriate HTTP headers (like Content-Type, ETag, Cache-Control).
    // - Handling caching efficiently.
    return await getAssetFromKV(event);
  } catch (e) {
    // If getAssetFromKV throws an error, it usually means the requested asset
    // was not found (a 404 Not Found error).
    const url = new URL(event.request.url);

    // Check if the error is specifically a 'NotFoundError'.
    if (e.name === 'NotFoundError') {
      // --- IMPORTANT: Choose ONE of the following options for 404 handling ---

      // Option 1 (Recommended for SPA-like Astro sites): Serve index.html for client-side routing.
      // This means if a path like /about is requested, and no /about.html exists,
      // it will serve index.html, letting Astro's client-side router handle the path.
      try {
        url.pathname = '/index.html'; // Rewrite the URL path to index.html
        // Re-attempt to get the asset (index.html) with the modified request.
        const notFoundResponse = await getAssetFromKV(event, {
          mapRequestToAsset: request => new Request(url.toString(), request),
        });
        // Return the index.html content with a 200 OK status, as it's a valid SPA entry point.
        return new Response(notFoundResponse.body, notFoundResponse);
      } catch (innerE) {
        // Fallback if even index.html isn't found (should be rare if project is built correctly).
        return new Response('Not Found (and index.html fallback failed)', { status: 404 });
      }
      // Option 2 (Alternative): Serve a specific 404.html page.
      // If you have a custom 404.html file in your `public` directory (which Astro copies to `dist`),
      // you can serve that.
      /*
      try {
        url.pathname = '/404.html'; // Assume you have a 404.html in your public/ directory
        const notFoundResponse = await getAssetFromKV(event, {
          mapRequestToAsset: request => new Request(url.toString(), request),
        });
        // Return the 404.html content with a 404 Not Found status.
        return new Response(notFoundResponse.body, { ...notFoundResponse, status: 404 });
      } catch (innerE) {
        return new Response('Not Found', { status: 404 }); // Generic 404 if custom 404.html not found
      }
      */

    }
    // Handle other types of errors (e.g., network issues, internal server errors).
    else {
      console.error('Worker caught an unhandled error:', e); // Log the error for debugging
      return new Response(`Internal Server Error: ${e.message}`, { status: 500 });
    }
  }
}