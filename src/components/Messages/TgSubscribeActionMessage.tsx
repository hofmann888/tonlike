import TgLinkButton from "@/components/Common/TgLinkButton";

export default function TgSubscribeActionMessage() {
  const bot = process.env.NEXT_PUBLIC_TG_BOT_NAME as string;
  const botLink = `https://t.me/${bot}`;

  return (
    <p className="text-medium">
      In order for us to verify the completion of the task for the channel, you need to add our bot 
      <TgLinkButton link={botLink} className="mx-1 text-medium">@{bot}</TgLinkButton> 
      as an administrator of the channel (this does not apply to groups).
      <br /><br />
      You can still create a task without this action. 
      However, without administrator rights, we cannot guarantee that the task will be properly completed by other users.
    </p>
  )
}