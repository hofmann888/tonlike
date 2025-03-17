import { useTranslations } from "next-intl";
import TgLinkButton from "@/components/Common/TgLinkButton";

export default function TgBoostActionMessage() {
  const t = useTranslations('i18n');

  const bot = process.env.NEXT_PUBLIC_TG_BOT_NAME as string;
  const botLink = `https://t.me/${bot}`;

  // TODO: replace with one tgBoostTaskAlertMsg with variable (${botLinkJSX})
  return (
    <p className="text-medium">
      {t('tgBoostTaskAlertMsg1')}
      <TgLinkButton link={botLink} className="mx-1 text-medium">@{bot}</TgLinkButton>
      {t('tgBoostTaskAlertMsg2')}
      <br /><br />
      {t('tgTaskAlertSubMsg')}
    </p>
  )
}