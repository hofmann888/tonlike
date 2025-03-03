import { useEffect } from 'react';
import { Button } from '@heroui/button';
import { AppEnv, AppEnvEnum } from '@/lib/definitions';

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

  const appEnv = process.env.NEXT_PUBLIC_APP_ENV as AppEnv; 

  return (
    <div className="py-5 px-2 flex flex-col justify-center items-center h-[100vh]">
      <h2>Something went wrong...</h2>

      {appEnv !== AppEnvEnum.PROD && // TODO?: AppEnvEnum.STAGE?
        <p className="text-danger text-medium mt-1">
          <code>
            {error.message}
          </code>
        </p>
      }

      <Button color="primary" variant="bordered" className="mt-3" onPress={() => reset && reset()}>Try again</Button>
    </div>
  );
}