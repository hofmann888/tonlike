import { useTranslations } from "next-intl";
import TgLinkButton from "@/components/Common/TgLinkButton";

export default function TgSubscribeActionMessage() {
  const t = useTranslations('components.TgSubscribeActionMessage');

  const bot = process.env.NEXT_PUBLIC_TG_BOT_NAME as string;
  const botLink = `https://t.me/${bot}`;

  return (
    <p className="text-medium">
      {t.rich('message', {
        bot: bot,
        TgLinkButton: (chunks) => <TgLinkButton link={botLink} className="mx-1 text-medium">{chunks}</TgLinkButton>
      })}
      <br /><br />
      {t('sub')}
    </p>
  )
}