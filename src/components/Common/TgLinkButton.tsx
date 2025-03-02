import { tgOpenLink } from "@/utils/helpers";
import { Button } from "@heroui/button";

export default function TgLinkButton({ 
  link, text, className
}: { 
  link: string, 
  text: string,
  className?: string 
}) {
  return (
    <Button 
      color="primary" 
      variant="light" 
      className={`p-0 h-auto gap-0 data-[hover=true]:bg-tranparent text-medium ${className}`}
      onPress={() => tgOpenLink(link)}
      disableRipple
      disableAnimation
    >
      {text}
    </Button> 
  )
}