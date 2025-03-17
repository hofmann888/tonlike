import { Button } from "@heroui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function CreateTaskButton() {
  const t = useTranslations('i18n');

  return (
    <Button
      as={Link}
      color="primary"
      href="/tasks/create"
      variant="shadow"
      size="lg"
      className="w-full mb-2 mt-2"
    >
      {t('createTask')}
    </Button>
  )
}