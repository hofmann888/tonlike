import { useEffect } from 'react';

export function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset?: () => void
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  // TODO!: hide error on prod

  return (
    <div className='error-page'>
      <h2>Something went wrong!</h2>
      <blockquote>
        <code>
          {error.message}
        </code>
      </blockquote>
      {reset && <button onClick={() => reset()}>Try again</button>}
    </div>
  );
}