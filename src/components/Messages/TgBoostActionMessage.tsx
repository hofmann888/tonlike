import TgLinkButton from "../Common/TgLinkButton";

export default function TgBoostActionMessage() {
  const bot = process.env.NEXT_PUBLIC_TG_BOT_NAME as string;
  const botLink = `https://t.me/${bot}`;

  return (
    <p className="text-medium">
      In order for us to verify the completion of the task, you need to add our bot 
      <TgLinkButton link={botLink} text={`@${bot}`} />
      as an administrator of the group or channel.
      <br /><br />
      You can still create a task without this action. However, without administrator rights, we cannot guarantee that the task will be properly completed by other users.
    </p>
  )
}