'use client'
 
import { useEffect } from 'react';
import ErrorPage from './error';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.log('root global-error.tsx');
  }, [error])

  return (
    <html className="dark">
      <body>
        <ErrorPage error={error} reset={reset} />
      </body>
    </html>
  )
}