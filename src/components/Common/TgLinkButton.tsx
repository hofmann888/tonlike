import { tgOpenLink } from "@/utils/helpers";
import { Button } from "@heroui/button";
import { ReactNode } from 'react';

export default function TgLinkButton({ 
  link, className, children, endContent
}: { 
  link: string, 
  className?: string 
  children: ReactNode,
  endContent?: ReactNode, 
}) {
  return (
    <Button 
      color="primary" 
      variant="light" 
      className={`p-0 h-auto gap-0 data-[hover=true]:bg-tranparent ${className}`}
      endContent={endContent}
      onPress={() => tgOpenLink(link)}
      disableRipple
      disableAnimation
    >
      {children}
    </Button> 
  )
}