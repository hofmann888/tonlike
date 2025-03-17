import { useTranslations } from "next-intl";
import TgLinkButton from "@/components/Common/TgLinkButton";

export default function TgSubscribeActionMessage() {
  const t = useTranslations('i18n');

  const bot = process.env.NEXT_PUBLIC_TG_BOT_NAME as string;
  const botLink = `https://t.me/${bot}`;

  // TODO: replace with one tgSubscribeTaskAlertMsg with variable (${botLinkJSX})
  return (
    <p className="text-medium">
      {t('tgSubscribeTaskAlertMsg1')}
      <TgLinkButton link={botLink} className="mx-1 text-medium">@{bot}</TgLinkButton> 
      {t('tgSubscribeTaskAlertMsg2')}
      <br /><br />
      {t('tgTaskAlertSubMsg')}
    </p>
  )
}