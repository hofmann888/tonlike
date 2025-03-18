import { useEffect } from 'react';
import { Button } from '@heroui/button';
import { useTranslations } from 'next-intl';
import { AppEnv, AppEnvEnum } from '@/lib/definitions';

// TODO!: set reset to resresh the page
export function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset?: () => void
}) {
  const appEnv = process.env.NEXT_PUBLIC_APP_ENV as AppEnv;

  const t = useTranslations('components.ErrorPage');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="py-5 px-2 flex flex-col justify-center items-center h-[100vh]">
      <h2>{t('error')}</h2>

      {appEnv !== AppEnvEnum.PROD && // TODO?: AppEnvEnum.STAGE?
        <p className="text-danger text-medium mt-1">
          <code>
            {error.message}
          </code>
        </p>
      }

      <Button color="primary" variant="bordered" className="mt-3" onPress={() => reset && reset()}>{t('tryAgain')}</Button>
    </div>
  );
}