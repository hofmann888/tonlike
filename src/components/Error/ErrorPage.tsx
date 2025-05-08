import { useEffect } from 'react';
import { Button } from '@heroui/button';
import { useTranslations } from 'next-intl';
import { usePathname } from "next/navigation";
import { AppEnv, AppEnvEnum } from '@/lib/definitions';
import { revalidatePathAction } from '@/core/server-actions';

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
  const pathname = usePathname();

  async function reload() {
    await revalidatePathAction(pathname);
    location.reload();
  }

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

      <Button color="primary" variant="bordered" className="mt-3" onPress={() => reload()}>{t('tryAgain')}</Button>
    </div>
  );
}